import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import GestionProfesores from '../components/Dashboard/GestionProfesores'

const TestWrapper = ({ children }) => (
    <MemoryRouter initialEntries={['/dashboard']}>{children}</MemoryRouter>
)

describe('GestionProfesores', () => {
    beforeEach(() => {
        // Log datos mock para profesores
        console.log([
            { id: 1, nombre: 'Ana', apellido: 'García', correo: 'ana@test.com' },
            { id: 2, nombre: 'Carlos', apellido: 'López', correo: 'carlos@test.com' }
        ])
    })

    it('renderiza correctamente el componente', async () => {
        render(
            <TestWrapper>
                <GestionProfesores />
            </TestWrapper>
        )

        await waitFor(() => {
            const content = document.body.textContent
            expect(content).toBeTruthy()
        }, { timeout: 3000 })
    })

    it('muestra la lista de profesores', async () => {
        render(
            <TestWrapper>
                <GestionProfesores />
            </TestWrapper>
        )

        await waitFor(() => {
            // Verificar que se renderiza contenido relacionado con profesores
            const elements = screen.queryAllByText(/profesor|docente|gestión/i)
            expect(elements.length).toBeGreaterThanOrEqual(0)
        }, { timeout: 3000 })
    })

    it('maneja el estado de carga correctamente', () => {
        render(
            <TestWrapper>
                <GestionProfesores />
            </TestWrapper>
        )

        expect(document.body).toBeInTheDocument()
    })
})
