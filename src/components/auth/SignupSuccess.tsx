import React from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CheckCircle, Mail } from "lucide-react";

interface SignupSuccessProps {
  email?: string;
  onContinue?: () => void;
}

const SignupSuccess = ({
  email = "your email",
  onContinue = () => {},
}: SignupSuccessProps) => {
  return (
    <Card className="w-full max-w-md mx-auto bg-white">
      <CardHeader className="pb-4 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">
          Sign Up Successful!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <p className="text-muted-foreground">
          Thank you for creating an account. We've sent a confirmation email to:
        </p>
        <div className="flex items-center justify-center gap-2 font-medium text-primary">
          <Mail className="h-4 w-4" />
          <span>{email}</span>
        </div>
        <div className="bg-muted/50 p-4 rounded-lg text-sm mt-4">
          <p className="font-medium mb-1">Please check your inbox</p>
          <p className="text-muted-foreground">
            Click the verification link in the email to complete your
            registration. If you don't see it, please check your spam folder.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={onContinue}>
          Continue to Login
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SignupSuccess;
