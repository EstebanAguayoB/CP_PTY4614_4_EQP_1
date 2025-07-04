import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import LoginForm from '../components/LoginForm'

// Helper function to create chainable mock
const createChainableMock = (finalData = [], finalError = null) => {
    const mock = {
        select: vi.fn(() => mock),
        from: vi.fn(() => mock),
        insert: vi.fn(() => mock),
        update: vi.fn(() => mock),
        delete: vi.fn(() => mock),
        upsert: vi.fn(() => mock),
        eq: vi.fn(() => mock),
        single: vi.fn(() => Promise.resolve({
            data: Array.isArray(finalData) ? (finalData.length > 0 ? finalData[0] : null) : finalData,
            error: finalError
        })),
        then: vi.fn((resolve) => resolve({ data: finalData, error: finalError })),
    }

    return mock
}

// Mock del hook useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    }
})

// Mock de Supabase
vi.mock('../lib/supabase.js', () => ({
    supabase: {
        auth: {
            signInWithPassword: vi.fn(),
        },
    },
}))

// Mock de react-toastify
vi.mock('react-toastify', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
        loading: vi.fn(() => 'loading-id'),
        update: vi.fn(),
        dismiss: vi.fn(),
    },
    ToastContainer: vi.fn(() => null),
}))

// Mock de notifications
vi.mock('../utils/notifications', () => ({
    showToast: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
        loading: vi.fn(() => 'loading-id'),
    },
}))

// Mock de localStorage
const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
})

const TestWrapper = ({ children }) => (
    <BrowserRouter>{children}</BrowserRouter>
)

describe('LoginForm', () => {
    let user

    beforeEach(() => {
        vi.clearAllMocks()
        user = userEvent.setup()

        // Mock navigator.onLine
        Object.defineProperty(navigator, 'onLine', {
            writable: true,
            value: true,
        })
    })

    it('renderiza correctamente todos los elementos del formulario', () => {
        render(
            <TestWrapper>
                <LoginForm />
            </TestWrapper>
        )

        expect(screen.getByLabelText(/correo institucional/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
        expect(screen.getByRole('checkbox', { name: /recuérdame/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
        expect(screen.getByText('← Volver al inicio')).toBeInTheDocument()
    })

    it('permite ingresar email y contraseña', () => {
        render(
            <TestWrapper>
                <LoginForm />
            </TestWrapper>
        )

        const emailInput = screen.getByLabelText(/correo institucional/i)
        const passwordInput = screen.getByLabelText(/contraseña/i)

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
        fireEvent.change(passwordInput, { target: { value: 'password123' } })

        expect(emailInput.value).toBe('test@example.com')
        expect(passwordInput.value).toBe('password123')
    })

    it('muestra/oculta la contraseña al hacer clic en el icono', () => {
        render(
            <TestWrapper>
                <LoginForm />
            </TestWrapper>
        )

        const passwordInput = screen.getByLabelText(/contraseña/i)
        const toggleButtons = screen.getAllByRole('button')
        const toggleButton = toggleButtons.find(button =>
            button.querySelector('svg') &&
            button.getAttribute('tabindex') === '-1'
        )

        expect(passwordInput.type).toBe('password')

        if (toggleButton) {
            fireEvent.click(toggleButton)
            expect(passwordInput.type).toBe('text')
        }
    })

    it('maneja el checkbox de recordarme', () => {
        render(
            <TestWrapper>
                <LoginForm />
            </TestWrapper>
        )

        const checkbox = screen.getByRole('checkbox', { name: /recuérdame/i })
        expect(checkbox.checked).toBe(false)

        fireEvent.click(checkbox)
        expect(checkbox.checked).toBe(true)
    })

    it('valida campos requeridos antes del envío', () => {
        render(
            <TestWrapper>
                <LoginForm />
            </TestWrapper>
        )

        const emailInput = screen.getByLabelText(/correo institucional/i)
        const passwordInput = screen.getByLabelText(/contraseña/i)

        expect(emailInput).toBeRequired()
        expect(passwordInput).toBeRequired()
    })

    it('navega al inicio al hacer clic en "Volver al Inicio"', () => {
        render(
            <TestWrapper>
                <LoginForm />
            </TestWrapper>
        )

        const backButton = screen.getByText('← Volver al inicio')
        fireEvent.click(backButton)

        expect(mockNavigate).toHaveBeenCalledWith('/')
    })

    it('maneja el proceso de login correctamente', async () => {
        const { supabase } = await import('../lib/supabase.js')

        // Reset the mock before each test
        vi.clearAllMocks()

        // Mock navigator.onLine for connection check
        Object.defineProperty(navigator, 'onLine', {
            writable: true,
            value: true,
        })

        // Configure the auth mock to resolve successfully
        supabase.auth.signInWithPassword.mockResolvedValue({
            data: { user: { id: '1', email: 'test@example.com' } },
            error: null,
        })

        render(
            <TestWrapper>
                <LoginForm />
            </TestWrapper>
        )

        const emailInput = screen.getByLabelText(/correo institucional/i)
        const passwordInput = screen.getByLabelText(/contraseña/i)
        const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })

        // Enter valid email and password that meets validation criteria using fireEvent
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
        fireEvent.change(passwordInput, { target: { value: 'password123456' } })

        // Submit the form
        await act(async () => {
            fireEvent.click(submitButton)
        })

        // Wait for the async operation and verify the mock was called
        await waitFor(() => {
            expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123456',
            })
        }, { timeout: 10000 })
    }, 15000)

    it('guarda credenciales en localStorage cuando "recordarme" está activado', async () => {
        const { supabase } = await import('../lib/supabase.js')

        // Reset mocks
        vi.clearAllMocks()

        // Mock navigator.onLine for connection check
        Object.defineProperty(navigator, 'onLine', {
            writable: true,
            value: true,
        })

        // Configure the auth mock to resolve successfully
        supabase.auth.signInWithPassword.mockResolvedValue({
            data: { user: { id: '1', email: 'test@example.com' } },
            error: null,
        })

        render(
            <TestWrapper>
                <LoginForm />
            </TestWrapper>
        )

        const emailInput = screen.getByLabelText(/correo institucional/i)
        const passwordInput = screen.getByLabelText(/contraseña/i)
        const rememberCheckbox = screen.getByRole('checkbox', { name: /recuérdame/i })
        const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })

        // Use fireEvent for form inputs
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
        fireEvent.change(passwordInput, { target: { value: 'password123456' } })
        fireEvent.click(rememberCheckbox)

        await act(async () => {
            fireEvent.click(submitButton)
        })

        await waitFor(() => {
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('rememberedEmail', 'test@example.com')
        }, { timeout: 10000 })
    }, 15000)
})
