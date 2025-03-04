import { describe, it, expect } from 'vitest';
import { validateScore } from '../src/validateScore.js';

describe('validateScore Function', () => {
  // Basisvalidierung Tests
  describe('Basic Validation', () => {
    it('should validate a valid score', () => {
      const result = validateScore(75);
      expect(result.valid).toBe(true);
      expect(result.score).toBe(75);
      expect(result.passed).toBe(true);
      expect(result.grade).toBe('C');
    });

    it('should reject undefined score', () => {
      const result = validateScore(undefined);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Score ist erforderlich');
    });

    it('should reject non-numeric score', () => {
      const result = validateScore('75');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Score muss eine Zahl sein');
    });

    it('should reject scores outside 0-100 range', () => {
      const resultLow = validateScore(-10);
      const resultHigh = validateScore(110);

      expect(resultLow.valid).toBe(false);
      expect(resultLow.errors).toContain('Score muss zwischen 0 und 100 liegen');

      expect(resultHigh.valid).toBe(false);
      expect(resultHigh.errors).toContain('Score muss zwischen 0 und 100 liegen');
    });
  });

  // Strikte Validierung Tests
  describe('Strict Mode Validation', () => {
    it('should reject NaN in strict mode', () => {
      const result = validateScore(NaN, { strictMode: true });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Score muss eine gültige Zahl sein');
    });

    it('should reject non-integer scores in strict mode', () => {
      const result = validateScore(75.5, { strictMode: true });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Score muss eine ganze Zahl sein');
    });
  });

  // Bonus-Kategorien Tests
  describe('Bonus Categories', () => {
    it('should add correct bonus points for categories', () => {
      const result = validateScore(70, { 
        bonusCategories: ['Math', 'Science', 'Extra Credit'] 
      });
      
      
      // Überprüfen, ob die Bonuspunkte korrekt berechnet werden
      expect(result.score).toBe(76); // 3 Kategorien = 3 * 2 = 6 Bonuspunkte, 70 + 6 = 76
      expect(result.passed).toBe(true);
      expect(result.grade).toBe('C');
    });

    it('should cap bonus points at 10', () => {
      const result = validateScore(80, { 
        bonusCategories: ['Category1', 'Category2', 'Category3', 'Category4', 'Category5', 'Category6'] 
      });
      expect(result.score).toBe(90);
    });
  });

  // Schwellenwerte und Notenberechnung
  describe('Score Thresholds and Grading', () => {
    it.each([
      { score: 95, expectedGrade: 'A', expectedPassed: true },
      { score: 85, expectedGrade: 'B', expectedPassed: true },
      { score: 75, expectedGrade: 'C', expectedPassed: true },
      { score: 65, expectedGrade: 'D', expectedPassed: true },
      { score: 55, expectedGrade: 'F', expectedPassed: false }
    ])('should calculate grade and pass status correctly', ({ score, expectedGrade, expectedPassed }) => {
      const result = validateScore(score);
      expect(result.grade).toBe(expectedGrade);
      expect(result.passed).toBe(expectedPassed);
    });
  });

  // Benutzerdefinierte Schwellenwerte
  describe('Custom Passing Score', () => {
    it('should use custom passing score', () => {
      const result = validateScore(55, { passingScore: 50 });
      expect(result.passed).toBe(true);
    });
  });
});