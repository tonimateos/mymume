import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PixelAvatar from './PixelAvatar'
import React from 'react'

describe('PixelAvatar', () => {
    it('renders correctly with a seed', () => {
        const { container } = render(<PixelAvatar seed="test-seed" />)
        const svg = container.querySelector('svg')
        expect(svg).toBeInTheDocument()
        expect(container.firstChild).toHaveClass('relative', 'inline-block')
    })

    it('applies custom size', () => {
        const { container } = render(<PixelAvatar seed="test-seed" size={128} />)
        const div = container.firstChild as HTMLElement
        expect(div.style.width).toBe('128px')
        expect(div.style.height).toBe('128px')
    })

    it('applies custom className', () => {
        const { container } = render(<PixelAvatar seed="test-seed" className="custom-class" />)
        expect(container.firstChild).toHaveClass('custom-class')
    })
})
