export default function Footer() {
  return (
    <footer
      className="
        py-8
        text-center
        text-sm
      "
    >
      <p className="opacity-80">
        Built with &nbsp;
        <a
          href="https://nextjs.org"
          className="
            text-primary
            no-underline
          "
        >
          Next.js
        </a>
        &nbsp; • Deployed on &nbsp;
        <a href="https://vercel.com" className="text-primary">
          Vercel
        </a>
      </p>
      <p className="text-sm opacity-80">&copy;2023&nbsp;cullyfung</p>
    </footer>
  );
}
