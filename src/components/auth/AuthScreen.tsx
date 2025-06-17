import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthScreenProps {
  onSuccess?: () => void;
}

const AuthScreen = ({ onSuccess = () => {} }: AuthScreenProps) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-navy text-white">
      <div className="w-full max-w-md relative z-10">
        {/* Basketball icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                fill="currentColor"
                opacity="0.3"
              />
              <path
                d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z"
                stroke="currentColor"
                strokeWidth="0.5"
                fill="none"
              />
              <path
                d="M15 12c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z"
                fill="white"
              />
              <path
                d="M6 12c0-3.31 2.69-6 6-6"
                stroke="white"
                strokeWidth="1"
              />
              <path
                d="M18 12c0 3.31-2.69 6-6 6"
                stroke="white"
                strokeWidth="1"
              />
              <path d="M12 6v12" stroke="white" strokeWidth="1" />
              <path d="M6 12h12" stroke="white" strokeWidth="1" />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-center mb-2 text-white">
          RULE IQ
        </h1>
        <p className="text-sm text-center mb-8 text-white/80">
          PERFECT YOUR OFFICIATING KNOWLEDGE
        </p>

        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
          {isLogin ? (
            <LoginForm
              onSuccess={onSuccess}
              onSwitch={() => setIsLogin(false)}
            />
          ) : (
            <RegisterForm
              onSuccess={onSuccess}
              onSwitch={() => setIsLogin(true)}
            />
          )}
        </div>

        <p className="text-xs text-center mt-6 text-white/60">
          by{" "}
          <a
            href="https://refslife.substack.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-white/80"
          >
            Ref's Life
          </a>
        </p>
      </div>

      {/* Basketball court lines background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[300px] border-b border-white/20 rounded-b-[50%]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[300px] border-t border-white/20 rounded-t-[50%]"></div>
        <div className="absolute left-0 top-1/4 bottom-1/4 w-[100px] border-r border-white/20"></div>
        <div className="absolute right-0 top-1/4 bottom-1/4 w-[100px] border-l border-white/20"></div>
      </div>
    </div>
  );
};

export default AuthScreen;
