import { Container } from '../../ui/Container'
import { Link } from '../../ui/Link'
import { Icon } from '../../ui/Icon'
import type { IconName } from '../../ui/Icon'
import { useConsentStore } from '../../../store/consent.store'
import logo from '../../../assets/logo.webp'
import styles from './Footer.module.css'

interface EnlaceFooter {
  label: string
  modal?: string // placeholder heredado (aún sin contenido)
  to?: string // ruta interna real
  action?: 'cookies' // acción especial (reabrir panel de cookies)
}

const COLUMNS: { title: string; links: EnlaceFooter[] }[] = [
  {
    title: 'Plataforma',
    links: [
      { label: 'Sobre Nosotros', modal: 'sobre-nosotros' },
      { label: 'Cómo Funciona', modal: 'como-funciona' },
      { label: 'Únete como Aliado', modal: 'aliados' },
      { label: 'Prensa', modal: 'prensa' },
    ],
  },
  {
    title: 'Soporte',
    links: [
      { label: 'Contacto', modal: 'contacto' },
      { label: 'Preguntas Frecuentes', modal: 'faq' },
      { label: 'Centro de Ayuda', modal: 'ayuda' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Política de Tratamiento de Datos', to: '/politica-de-datos' },
      { label: 'Política de Cookies', to: '/politica-de-cookies' },
      { label: 'Configurar cookies', action: 'cookies' },
      { label: 'Mapa del sitio', to: '/mapa-del-sitio' },
      { label: 'Términos y Condiciones', to: '/terminos' },
    ],
  },
]

/**
 * Datos institucionales del footer (integración GOV.CO).
 *
 * ⚠️ DATOS DE EJEMPLO (MOCK) para la presentación. Antes de publicar hay que
 * reemplazarlos por los oficiales que entregue la Gobernación de Santander:
 * dirección, código postal, horarios, líneas telefónicas y correos. Teléfonos
 * con prefijo +57 (requisito del estándar GOV.CO).
 */
const INSTITUCIONAL = [
  { etiqueta: 'Dirección', valor: 'Calle 37 # 10-30, Palacio Amarillo, Bucaramanga' },
  { etiqueta: 'Código postal', valor: '680006' },
  { etiqueta: 'Horario', valor: 'Lun a vie, 8:00 a.m. – 12:00 m. y 2:00 – 6:00 p.m.' },
  { etiqueta: 'Conmutador', valor: '+57 (607) 691 5355' },
  { etiqueta: 'Línea gratuita', valor: '+57 018000 915 000' },
  { etiqueta: 'Línea anticorrupción', valor: '+57 018000 913 040' },
  { etiqueta: 'Correo institucional', valor: 'contactenos@santander.gov.co' },
  { etiqueta: 'Notificaciones judiciales', valor: 'notificaciones@santander.gov.co' },
]

const SOCIALS: { name: IconName; url: string }[] = [
  { name: 'facebook', url: 'https://www.facebook.com/share/1RiJvhh1Gp/' },
  { name: 'instagram', url: 'https://www.instagram.com/d4iv_id' },
  { name: 'tiktok', url: 'https://www.tiktok.com/@d4ividd' },
  { name: 'whatsapp', url: 'https://wa.me/573174613395' },
]

export function Footer() {
  const reabrir = useConsentStore((s) => s.reabrir)
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.brandHead}>
              <img src={logo} alt="" className={styles.brandLogo} />
              <span className={styles.brandName}>
                <strong className={styles.entidadNombre}>Gobernación de Santander</strong>
                <span className={styles.entidadSub}>
                  <span style={{ color: 'var(--brand-red, #D91A2A)' }}>Santander </span>
                  <span style={{ color: 'var(--brand-green-light, #20ba68)' }}>Accesible</span>
                  <span className={styles.entidadSede}> · Sede electrónica</span>
                </span>
              </span>
            </div>

            {/* Datos de contacto institucionales, dentro del mismo bloque. */}
            <dl className={styles.contacto} aria-label="Información de contacto institucional">
              {INSTITUCIONAL.map((d) => (
                <div key={d.etiqueta} className={styles.contactoItem}>
                  <dt>{d.etiqueta}</dt>
                  <dd>{d.valor}</dd>
                </div>
              ))}
            </dl>

            <div className={styles.social}>
              {SOCIALS.map((s) => (
                <Link
                  key={s.name}
                  to={s.url}
                  external
                  className={styles.socialIcon}
                  aria-label={s.name}
                >
                  <Icon name={s.name} size={16} />
                </Link>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} className={styles.col} aria-label={col.title}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.to ? (
                      <Link to={l.to}>{l.label}</Link>
                    ) : l.action === 'cookies' ? (
                      <button type="button" onClick={reabrir}>
                        {l.label}
                      </button>
                    ) : (
                      <button type="button" data-modal={l.modal}>
                        {l.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className={styles.bottom}>
          <p>
            © 2026 Gobernación de Santander — Santander Accesible. Todos los derechos reservados.
          </p>
          <p className={styles.madeIn}>
            Hecho con <span aria-hidden="true">♥</span> en Santander, Colombia
          </p>
        </div>
      </Container>

      {/* Banda oficial GOV.CO — Portal Único del Estado Colombiano. */}
      <div className={styles.govco}>
        <Container>
          <div className={styles.govcoInner}>
            <a
              href="https://www.gov.co"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.govcoLogo}
              aria-label="Ir al Portal Único del Estado Colombiano, GOV.CO (se abre en una pestaña nueva)"
            >
              <span className={styles.govcoGov}>GOV</span>
              <span className={styles.govcoCo}>.CO</span>
            </a>
            <div className={styles.govcoTexto}>
              <strong>Portal Único del Estado Colombiano</strong>
              <span>Gobierno de Colombia</span>
            </div>
            <nav className={styles.govcoLinks} aria-label="Enlaces del Estado">
              <a href="https://www.gov.co" target="_blank" rel="noopener noreferrer">
                gov.co
              </a>
              <a
                href="https://www.gov.co/ficha-tramites-y-servicios"
                target="_blank"
                rel="noopener noreferrer"
              >
                Trámites y servicios
              </a>
            </nav>
          </div>
        </Container>
      </div>
    </footer>
  )
}
