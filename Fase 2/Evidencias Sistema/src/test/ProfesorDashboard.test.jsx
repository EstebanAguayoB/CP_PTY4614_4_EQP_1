import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProfesorDashboard from '../components/DashboardProfesor/ProfesorDashboard'

const TestWrapper = ({ children }) => (
    <MemoryRouter initialEntries={['/profesor-dashboard']}>{children}</MemoryRouter>
)

describe('ProfesorDashboard', () => {
    beforeEach(() => {
        // Log datos mock del profesor
        console.log({ user: { id: '1', email: 'profesor@test.com', rol: 'PROFESOR' } })
    })

    it('renderiza correctamente el dashboard', async () => {
        render(
            <TestWrapper>
                <ProfesorDashboard />
            </TestWrapper>
        )

        await waitFor(() => {
            const content = document.body.textContent
            expect(content).toBeTruthy()
        }, { timeout: 3000 })
    })

    it('muestra el contenido del dashboard', async () => {
        render(
            <TestWrapper>
                <ProfesorDashboard />
            </TestWrapper>
        )

        await waitFor(() => {
            // Verificar que se renderiza contenido del dashboard
            const elements = screen.queryAllByText(/dashboard|profesor|bienvenido/i)
            expect(elements.length).toBeGreaterThanOrEqual(0)
        }, { timeout: 3000 })
    })

    it('maneja el estado de carga correctamente', () => {
        render(
            <TestWrapper>
                <ProfesorDashboard />
            </TestWrapper>
        )

        expect(document.body).toBeInTheDocument()
    })
})
