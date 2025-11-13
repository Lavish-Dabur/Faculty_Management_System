import prisma from "../utils/db.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const faculty = await prisma.faculty.findUnique({ where: { Email: email } });
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.faculty.update({
      where: { Email: email },
      data: {
        passwordResetToken,
        passwordResetExpires,
      },
    });

    // Always log reset link in development
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    console.log('Password reset link:', resetLink);

    // Try to send email, but don't fail if email is not configured
    try {
      if (process.env.EMAIL_USERNAME && process.env.EMAIL_PASSWORD) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USERNAME,
          to: email,
          subject: "Password Reset - Faculty Research Portal",
          text: `To reset your password, please click the following link: ${resetLink}`,
        };

        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully');
      } else {
        console.warn('Email credentials not configured. Check console for reset link.');
      }
    } catch (emailError) {
      console.error('Failed to send email:', emailError.message);
      console.log('You can still use this reset link:', resetLink);
    }

    res.status(200).json({ 
      message: "Password reset link generated. Check console for the link (email not configured).",
      resetLink: process.env.NODE_ENV === 'development' ? resetLink : undefined
    });
  } catch (error) {
    console.error("Error in forgotPassword controller:", error);
    res.status(500).json({ message: "Internal Server Error: " + error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const faculty = await prisma.faculty.findFirst({
      where: {
        passwordResetToken,
        passwordResetExpires: { gt: new Date() },
      },
    });

    if (!faculty) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await prisma.faculty.update({
      where: { FacultyID: faculty.FacultyID },
      data: {
        Password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};