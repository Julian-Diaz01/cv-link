import React from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

const NotFoundPage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <SEO
        title="404 - Page Not Found | Julian Diaz"
        description="The page you're looking for doesn't exist. Return to Julian Diaz's portfolio homepage."
        ogUrl="https://juliandiaz.web.app/404"
      />
      <h1>Oops! You're lost in space.</h1>
      <p>
        The page you're looking for is not here. Maybe it was swallowed by a
        black hole.
      </p>
      <p>
        Don't panic, you can always{' '}
        <Link
          to="/"
          style={{
            color: '#f5c422',
            textDecoration: 'none',
          }}
        >
          return to Earth
        </Link>{' '}
        or{' '}
        <Link
          to="/search"
          style={{
            color: '#f5c422',
            textDecoration: 'none',
          }}
        >
          search for another galaxy
        </Link>
        .
      </p>
      <div
        style={{
          position: 'relative',
          width: '66vw',
          height: '30vh',
          overflow: 'hidden',
          margin: 'auto',
        }}
      >
        <img
          src="/not_found.jpeg"
          alt=" "
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            mixBlendMode: 'lighten',
          }}
        />
      </div>
    </div>
  )
}

export default NotFoundPage
