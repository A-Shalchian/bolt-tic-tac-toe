import { FaGithub, FaLinkedin } from "react-icons/fa";

export const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gray-700 text-white p-4 text-center">
      <p>
        &copy; Made with ❤️ by <a>Arash Shalchian</a>
      </p>
      <div className="flex justify-center gap-4 mt-2">
        <a
          href="https://github.com/A-Shalchian"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub size={24} />
        </a>
        <a
          href="https://www.linkedin.com/in/arash-shalchian-230b06268/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedin size={24} />
        </a>
      </div>
    </footer>
  );
};
