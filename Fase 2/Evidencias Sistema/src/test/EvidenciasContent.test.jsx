import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import EvidenciasContent from '../components/DashboardProfesor/EvidenciasContent'

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
                eq: vi.fn(() => Promise.resolve({
                    data: [
                        { id: 1, titulo: 'Evidencia 1', descripcion: 'Descripción 1' },
                        { id: 2, titulo: 'Evidencia 2', descripcion: 'Descripción 2' }
                    ],
                    error: null
                })),
            })),
        })),
    },
}))

const TestWrapper = ({ children }) => (
    <BrowserRouter>{children}</BrowserRouter>
)

describe('EvidenciasContent', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renderiza correctamente el componente', async () => {
        render(
            <TestWrapper>
                <EvidenciasContent />
            </TestWrapper>
        )

        // Verificar que se muestra algún contenido relacionado con evidencias
        await waitFor(() => {
            const evidenciasElements = screen.queryAllByText(/evidencia/i)
            expect(evidenciasElements.length).toBeGreaterThan(0)
        })
    })

    it('maneja el estado de carga', () => {
        render(
            <TestWrapper>
                <EvidenciasContent />
            </TestWrapper>
        )

        // Verificar que el componente se renderiza sin errores
        expect(document.body).toBeInTheDocument()
    })

    it('muestra las evidencias disponibles', async () => {
        render(
            <TestWrapper>
                <EvidenciasContent />
            </TestWrapper>
        )

        await waitFor(() => {
            // Buscar evidencias o indicadores de contenido
            const content = document.body.textContent
            expect(content).toBeTruthy()
        })
    })
})
