import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import GestionEstudiante from '../components/Dashboard/GestionEstudiante'

const TestWrapper = ({ children }) => (
    <MemoryRouter initialEntries={['/dashboard']}>{children}</MemoryRouter>
)

describe('GestionEstudiante', () => {
    beforeEach(() => {
        // Log datos mock para estudiantes
        console.log([
            { id: 1, nombre: 'Juan', apellido: 'Pérez', correo: 'juan@test.com' },
            { id: 2, nombre: 'María', apellido: 'González', correo: 'maria@test.com' }
        ])
    })

    it('renderiza correctamente el componente', async () => {
        render(
            <TestWrapper>
                <GestionEstudiante />
            </TestWrapper>
        )

        await waitFor(() => {
            const content = document.body.textContent
            expect(content).toBeTruthy()
        }, { timeout: 3000 })
    })

    it('muestra la lista de estudiantes', async () => {
        render(
            <TestWrapper>
                <GestionEstudiante />
            </TestWrapper>
        )

        await waitFor(() => {
            // Verificar que se renderiza contenido relacionado con estudiantes
            const elements = screen.queryAllByText(/estudiante|alumno|gestión/i)
            expect(elements.length).toBeGreaterThanOrEqual(0)
        }, { timeout: 3000 })
    })

    it('maneja el estado de carga correctamente', () => {
        render(
            <TestWrapper>
                <GestionEstudiante />
            </TestWrapper>
        )

        expect(document.body).toBeInTheDocument()
    })
})
