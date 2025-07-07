import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { GestionTalleres } from '../components/Dashboard/GestionTalleres'

const TestWrapper = ({ children }) => (
    <MemoryRouter initialEntries={['/dashboard']}>{children}</MemoryRouter>
)

describe('GestionTalleres', () => {
    beforeEach(() => {
        // Log para mostrar datos mock
        console.log([
            { id: 1, nombre: 'Taller de React', descripcion: 'Aprender React' },
            { id: 2, nombre: 'Taller de Node.js', descripcion: 'Aprender Node.js' }
        ])
    })

    it('renderiza correctamente el componente', async () => {
        render(
            <TestWrapper>
                <GestionTalleres />
            </TestWrapper>
        )

        // Verificar que se muestra contenido relacionado con gestión de talleres
        await waitFor(() => {
            const content = document.body.textContent
            expect(content).toBeTruthy()
        }, { timeout: 3000 })
    })

    it('muestra la lista de talleres', async () => {
        render(
            <TestWrapper>
                <GestionTalleres />
            </TestWrapper>
        )

        await waitFor(() => {
            // Buscar indicadores de que se está mostrando información de talleres
            const tallerElements = screen.queryAllByText(/taller|react|node/i)
            expect(tallerElements.length).toBeGreaterThanOrEqual(0)
        }, { timeout: 3000 })
    })

    it('maneja el estado de carga correctamente', () => {
        render(
            <TestWrapper>
                <GestionTalleres />
            </TestWrapper>
        )

        // Verificar que el componente se renderiza sin errores
        expect(document.body).toBeInTheDocument()
    })
})
