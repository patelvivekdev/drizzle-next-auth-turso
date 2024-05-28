import { resend } from './resend';
import VerificationEmail from '../../emails/verificationEmail';
import ForgotPasswordEmail from '../../emails/forgotPasswordEmail';

export async function sendVerificationEmail(
  email: string,
  validationCode: string,
  time: number,
) {
  try {
    await resend.emails.send({
      from: 'no-reply@patelvivek.dev',
      to: email,
      subject: 'Verification Code for creating a new Account',
      react: VerificationEmail({ email, validationCode: validationCode, time }),
    });
    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    return { success: false, message: 'Failed to send verification email.' };
  }
}

export async function sendForgotPasswordEmail(
  email: string,
  userFirstName: string,
  resetPasswordLink: string,
  time: number,
) {
  try {
    await resend.emails.send({
      from: 'no-reply@patelvivek.dev',
      to: email,
      subject: 'Password Reset Request',
      react: ForgotPasswordEmail({
        userFirstName,
        resetPasswordLink,
        time,
      }),
    });
    return {
      success: true,
      message: 'Password reset email sent successfully.',
    };
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    return { success: false, message: 'Failed to send password reset email.' };
  }
}
