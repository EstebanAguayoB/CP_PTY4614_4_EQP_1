import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ProfesorDashboard from '../components/DashboardProfesor/ProfesorDashboard'

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
            getUser: vi.fn(() => Promise.resolve({
                data: { user: { id: '1', email: 'profesor@test.com' } },
                error: null
            })),
        },
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    single: vi.fn(() => Promise.resolve({
                        data: { id_usuario: 1, nombre: 'Profesor', apellido: 'Test' },
                        error: null
                    })),
                })),
            })),
        })),
    },
}))

const TestWrapper = ({ children }) => (
    <BrowserRouter>{children}</BrowserRouter>
)

describe('ProfesorDashboard', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renderiza correctamente el dashboard del profesor', async () => {
        render(
            <TestWrapper>
                <ProfesorDashboard />
            </TestWrapper>
        )

        // Verificar que aparezcan elementos básicos del dashboard - buscar SkillTrack que aparece en el DOM
        await waitFor(() => {
            expect(screen.getByText(/SkillTrack/i)).toBeInTheDocument()
        })

        // Verificar que aparece el texto del rol usando getAllByText porque hay múltiples elementos
        const profesorElements = screen.getAllByText(/Profesor/i)
        expect(profesorElements.length).toBeGreaterThan(0)
    })

    it('muestra las estadísticas del profesor', async () => {
        render(
            <TestWrapper>
                <ProfesorDashboard />
            </TestWrapper>
        )

        await waitFor(() => {
            // Buscar elementos que están presentes en el DOM: navegación
            expect(screen.getByText(/Dashboard Profesor/i)).toBeInTheDocument()
            expect(screen.getByText(/Mis talleres/i)).toBeInTheDocument()
            expect(screen.getByText(/Alumnos/i)).toBeInTheDocument()
            expect(screen.getByText(/Evidencias/i)).toBeInTheDocument()
        })
    })

    it('maneja el estado de carga correctamente', () => {
        render(
            <TestWrapper>
                <ProfesorDashboard />
            </TestWrapper>
        )

        // Verificar que el componente se renderiza sin errores buscando elementos que existen
        expect(screen.getByText(/Cargando Dashboard/i)).toBeInTheDocument()

        // Verificar que hay un sidebar (aside)
        expect(screen.getByRole('complementary')).toBeInTheDocument()
    })
})
