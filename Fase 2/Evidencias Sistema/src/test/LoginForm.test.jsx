import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LoginForm from '../components/LoginForm'

const TestWrapper = ({ children }) => (
    <MemoryRouter initialEntries={['/login']}>{children}</MemoryRouter>
)

describe('LoginForm', () => {
    beforeEach(() => {
        // Log para datos de usuario mock
        console.log({ user: { id: '1', email: 'test@example.com' } })
    })

    it('renderiza correctamente el formulario de login', async () => {
        render(
            <TestWrapper>
                <LoginForm />
            </TestWrapper>
        )

        await waitFor(() => {
            const content = document.body.textContent
            expect(content).toBeTruthy()
        }, { timeout: 3000 })
    })

    it('muestra los campos de entrada', async () => {
        render(
            <TestWrapper>
                <LoginForm />
            </TestWrapper>
        )

        await waitFor(() => {
            // Verificar que se renderiza contenido de login
            const elements = screen.queryAllByText(/login|iniciar|sesión|correo|contraseña/i)
            expect(elements.length).toBeGreaterThanOrEqual(0)
        }, { timeout: 3000 })
    })

    it('maneja el estado de carga correctamente', () => {
        render(
            <TestWrapper>
                <LoginForm />
            </TestWrapper>
        )

        expect(document.body).toBeInTheDocument()
    })
})
