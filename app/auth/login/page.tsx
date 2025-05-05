"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from 'next/image'
import styles from './login.module.css'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          rememberMe,
        }),
      })

      const data = await response.json()

      if (data.success) {
        router.push('/dashboard')
      } else {
        setError(data.message || 'Login failed. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again later.')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h2>Login</h2>
          <form className={styles.signupForm} onSubmit={handleSubmit}>
            <div className={styles.inputField}>
              <input 
                type="email" 
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                disabled={isLoading}
              />
              <i className="fas fa-envelope"></i>
                    </div>
            <div className={styles.inputField}>
              <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                disabled={isLoading}
              />
              <i className="fas fa-lock"></i>
            </div>
            {error && <div className={styles.invalidFeedback}>{error}</div>}
            <div className={styles.rememberMe}>
              <label className={styles.customCheckbox}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                <span className={styles.checkmark}></span>
                Remember Me
              </label>
            </div>
            <div className={styles.submitContainer}>
              <button 
                type="submit"
                className={styles.signupButton}
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
            </form>

          <Link href="/auth/forgot-password" className={styles.forgotPassword}>
            Forgot Your Password?
          </Link>

          <div className={styles.socialSignup}>
            <p>Or Sign in with social platforms</p>
            <div className={styles.socialIcons}>
              <div className={styles.parent}>
                <div className={`${styles.child} ${styles.child1}`}>
                  <button className={styles.button}>
                    <i className="fab fa-facebook-f" style={{ color: '#1877f2' }}></i>
                  </button>
                </div>
                <div className={`${styles.child} ${styles.child2}`}>
                  <button className={styles.button}>
                    <i className="fab fa-google" style={{ color: '#ea4335' }}></i>
                  </button>
                </div>
                <div className={`${styles.child} ${styles.child3}`}>
                  <button className={styles.button}>
                    <i className="fab fa-twitter" style={{ color: '#1da1f2' }}></i>
                  </button>
                </div>
                <div className={`${styles.child} ${styles.child4}`}>
                  <button className={styles.button}>
                    <i className="fab fa-linkedin-in" style={{ color: '#0077b5' }}></i>
                  </button>
                </div>
                <div className={`${styles.child} ${styles.child5}`}>
                  <button className={styles.button}>
                    <i className="fab fa-instagram" style={{ color: '#e1306c' }}></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.curveDivider}></div>

        <div className={styles.infoContainer}>
          <div className={styles.infoContent}>
            <h3>New Here?</h3>
            <p>
              Sign up and discover a great amount of new opportunities!
            </p>
            <Link href="/auth/register" className={styles.signinLink}>
              Sign Up
            </Link>
          </div>
          <div className={styles.illustration}>
            <Image
              src="/images/loginq.svg"
              alt="Login illustration"
              width={300}
              height={300}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}

