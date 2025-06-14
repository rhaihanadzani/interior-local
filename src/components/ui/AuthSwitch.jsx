import Link from "next/link";

const AuthSwitch = ({ type }) => {
  return (
    <div className="text-sm text-gray-600">
      {type === "login" ? (
        <>
          Don't have an account?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-[#0B1D51] hover:text-[#0B1D51]/80 transition-colors"
          >
            Sign up
          </Link>
        </>
      ) : (
        <>
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-[#0B1D51] hover:text-[#0B1D51]/80 transition-colors"
          >
            Sign in
          </Link>
        </>
      )}
    </div>
  );
};

export default AuthSwitch;
