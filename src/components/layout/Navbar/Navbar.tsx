import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from '../../ui/Link'
import { NavLink } from '../../ui/NavLink'
import { Button } from '../../ui/Button'
import { useThemeStore } from '../../../store/theme.store'
import logo from '../../../assets/logo.webp'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { label: 'Transporte', to: '/transporte' },
  { label: 'Hospedaje', to: '/hospedaje' },
  { label: 'Planes Turísticos', to: '/planes-turisticos' },
  { label: 'E-Commerce', to: '/ecommerce' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggle)

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="Santander Accesible" className={styles.logoImg} />
          <span className={styles.logoText}>
            <span style={{ color: 'var(--brand-red, #D91A2A)' }}>SANTANDER </span>
            <span style={{ color: 'var(--brand-yellow, #FFC72C)' }}>• </span>
            <span style={{ color: 'var(--brand-green, #008744)' }}>ACCESIBLE</span>
          </span>
        </Link>

        <ul className={styles.links}>
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} className={styles.link} activeClassName={styles.active}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          {/* CTA a la experiencia VR: destaca el metaverso desde cualquier página. */}
          <Link
            to="/metaverso/bucaramanga"
            className={styles.metaverso}
            aria-label="Explorar Santander en el metaverso de realidad virtual"
          >
            <span aria-hidden="true">🥽</span> Metaverso VR
          </Link>

          <button
            className={styles.darkToggle}
            onClick={toggleTheme}
            aria-label="Cambiar tema"
            title="Cambiar tema"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Acceder de escritorio (se oculta en móvil) */}
          <Button size="sm" className={styles.acceder} onClick={() => navigate('/login')}>
            Acceder
          </Button>

          <button className={styles.hamburger} onClick={() => setOpen((o) => !o)} aria-label="Menú">
            ☰
          </button>
        </div>
      </div>

      {/* Menú móvil: links + Metaverso + Acceder */}
      <div className={`${styles.mobile} ${open ? styles.mobileOpen : ''}`}>
        {NAV_LINKS.map((link) => (
          <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)}>
            {link.label}
          </NavLink>
        ))}
        <Link
          to="/metaverso/bucaramanga"
          className={styles.metaversoMobile}
          onClick={() => setOpen(false)}
          aria-label="Explorar Santander en el metaverso de realidad virtual"
        >
          <span aria-hidden="true">🥽</span> Metaverso VR
        </Link>
        <Button
          size="sm"
          fullWidth
          onClick={() => {
            setOpen(false)
            navigate('/login')
          }}
        >
          Acceder
        </Button>
      </div>
    </nav>
  )
}
