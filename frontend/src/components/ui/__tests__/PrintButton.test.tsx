import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PrintButton, useBeforePrint } from '../PrintButton';

describe('PrintButton', () => {
  beforeEach(() => {
    vi.spyOn(window, 'print').mockImplementation(() => {});
  });

  it('renders with default label', () => {
    render(<PrintButton />);
    const button = screen.getByRole('button', { name: /print/i });
    expect(button).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<PrintButton label="Print Certificate" />);
    expect(screen.getByText('Print Certificate')).toBeInTheDocument();
  });

  it('renders the Printer icon', () => {
    render(<PrintButton />);
    const button = screen.getByRole('button');
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('calls window.print on click', () => {
    render(<PrintButton />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(window.print).toHaveBeenCalledTimes(1);
  });

  it('calls onBeforePrint callback before window.print', () => {
    const onBeforePrint = vi.fn();
    render(<PrintButton onBeforePrint={onBeforePrint} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onBeforePrint).toHaveBeenCalledBefore(window.print);
  });

  it('does not render label text in iconOnly mode', () => {
    render(<PrintButton iconOnly label="Print" />);
    expect(screen.queryByText('Print')).not.toBeInTheDocument();
  });

  it('sets aria-label in iconOnly mode', () => {
    render(<PrintButton iconOnly label="Print Page" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Print Page');
  });

  it('sets title in iconOnly mode', () => {
    render(<PrintButton iconOnly label="Print Page" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Print Page');
  });

  it('applies custom className', () => {
    render(<PrintButton className="custom-class" />);
    const button = screen.getByRole('button');
    expect(button.className).toContain('custom-class');
  });

  it('has print-button class for CSS visibility in print', () => {
    render(<PrintButton />);
    const button = screen.getByRole('button');
    expect(button.className).toContain('print-button');
  });

  it('passes additional button props', () => {
    render(<PrintButton data-testid="print-btn" disabled />);
    const button = screen.getByTestId('print-btn');
    expect(button).toBeDisabled();
  });

  it('sets type="button" to prevent form submission', () => {
    render(<PrintButton />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });
});

describe('useBeforePrint', () => {
  it('calls callback on beforeprint event', () => {
    const callback = vi.fn();
    function TestComponent() {
      useBeforePrint(callback);
      return null;
    }
    render(<TestComponent />);
    window.dispatchEvent(new Event('beforeprint'));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('removes event listener on unmount', () => {
    const callback = vi.fn();
    function TestComponent() {
      useBeforePrint(callback);
      return null;
    }
    const { unmount } = render(<TestComponent />);
    unmount();
    window.dispatchEvent(new Event('beforeprint'));
    expect(callback).not.toHaveBeenCalled();
  });
});
