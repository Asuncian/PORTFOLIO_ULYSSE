export default function Footer() {
  return (
    <footer>
      <div className="footer-logo">
        Ulysse<span>.</span>
      </div>
      <div className="footer-links">
        <a href="#pour-qui">Pour qui</a>
        <a href="#projets">Projets</a>
        <a href="#methode">Méthode</a>
        <a href="#contact">Contact</a>
      </div>
      <p className="footer-copy">© {new Date().getFullYear()} Ulysse Goming Jobert</p>
    </footer>
  )
}
