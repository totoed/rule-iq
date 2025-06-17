import React from "react";

const AppFooter = () => {
  return (
    <footer className="mt-8 text-center text-xs text-white/40 bg-navy">
      <p>
        © {new Date().getFullYear()} Rule IQ by{" "}
        <a
          href="https://refslife.substack.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline text-white/60"
        >
          Ref's Life
        </a>
      </p>
    </footer>
  );
};

export default AppFooter;
