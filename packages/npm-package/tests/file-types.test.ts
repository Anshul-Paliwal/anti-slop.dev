import { describe, it, expect } from 'vitest';
import { FileTypeRegistry, defaultFileTypeRegistry } from '../src/discovery/file-types';

describe('FileTypeRegistry', () => {
  it('should support default web development extensions', () => {
    expect(defaultFileTypeRegistry.isSupported('app.ts')).toBe(true);
    expect(defaultFileTypeRegistry.isSupported('Component.tsx')).toBe(true);
    expect(defaultFileTypeRegistry.isSupported('script.js')).toBe(true);
    expect(defaultFileTypeRegistry.isSupported('index.jsx')).toBe(true);
    expect(defaultFileTypeRegistry.isSupported('styles.css')).toBe(true);
    expect(defaultFileTypeRegistry.isSupported('App.vue')).toBe(true);
    expect(defaultFileTypeRegistry.isSupported('Page.svelte')).toBe(true);

    // Unsupported by default
    expect(defaultFileTypeRegistry.isSupported('image.png')).toBe(false);
    expect(defaultFileTypeRegistry.isSupported('data.csv')).toBe(false);
  });

  it('should resolve correct language categories', () => {
    expect(defaultFileTypeRegistry.getCategory('index.ts')).toBe('typescript');
    expect(defaultFileTypeRegistry.getCategory('App.tsx')).toBe('tsx');
    expect(defaultFileTypeRegistry.getCategory('bundle.js')).toBe('javascript');
    expect(defaultFileTypeRegistry.getCategory('main.css')).toBe('css');
    expect(defaultFileTypeRegistry.getCategory('unknown.xyz')).toBe('unknown');
  });

  it('should allow easy runtime registration of new file types', () => {
    const customRegistry = new FileTypeRegistry();

    expect(customRegistry.isSupported('script.py')).toBe(false);

    // Easily add Python support
    customRegistry.register({
      extension: '.py',
      category: 'unknown',
      label: 'Python Source',
    });

    expect(customRegistry.isSupported('script.py')).toBe(true);
    expect(customRegistry.getDefinition('script.py')?.label).toBe('Python Source');
  });

  it('should generate valid glob patterns', () => {
    const customRegistry = new FileTypeRegistry([
      { extension: '.ts', category: 'typescript', label: 'TypeScript' },
      { extension: '.js', category: 'javascript', label: 'JavaScript' },
    ]);

    expect(customRegistry.getGlobPattern()).toBe('**/*.{ts,js}');
    expect(customRegistry.getGlobPattern(['.ts'])).toBe('**/*.ts');
  });
});
