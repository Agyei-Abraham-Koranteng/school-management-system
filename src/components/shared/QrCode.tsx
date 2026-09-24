import React from 'react';

interface QrCodeProps {
  value: string;
  size?: number;
  className?: string;
}

/**
 * High-fidelity deterministic SVG QR-like code renderer for digital student IDs and transcript verification
 */
export const QrCode: React.FC<QrCodeProps> = ({ value, size = 120, className = "" }) => {
  // Generate deterministic binary pattern from value string
  const str = value || '';
  let hash = 7919;
  for (let idx = 0; idx < str.length; idx++) {
    hash = (hash + str.charCodeAt(idx) * (idx + 1)) % 2147483647;
  }
  const gridSize = 21; // Standard Version 1 QR code size
  
  // Matrix initialization
  const matrix: boolean[][] = Array.from({ length: gridSize }, () => Array(gridSize).fill(false));

  // Finder patterns at three corners (7x7)
  const drawFinder = (r: number, c: number) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (
          i === 0 || i === 6 || j === 0 || j === 6 || // Outer ring
          (i >= 2 && i <= 4 && j >= 2 && j <= 4)      // Inner square
        ) {
          matrix[r + i][c + j] = true;
        }
      }
    }
  };

  drawFinder(0, 0); // Top-left
  drawFinder(0, gridSize - 7); // Top-right
  drawFinder(gridSize - 7, 0); // Bottom-left

  // Timing patterns
  for (let i = 8; i < gridSize - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Pseudo-random deterministic data filling based on string characters
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      // Don't overwrite finder patterns
      const inTL = r < 8 && c < 8;
      const inTR = r < 8 && c >= gridSize - 8;
      const inBL = r >= gridSize - 8 && c < 8;
      const inTiming = (r === 6 && c >= 8 && c < gridSize - 8) || (c === 6 && r >= 8 && r < gridSize - 8);

      if (!inTL && !inTR && !inBL && !inTiming) {
        const seed = (hash * (r + 1) * 31 + (c + 1) * 17 + value.charCodeAt((r + c) % value.length)) % 100;
        matrix[r][c] = seed > 48;
      }
    }
  }

  const cellSize = size / gridSize;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`bg-white p-1.5 rounded-lg shadow-2xs ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width={size} height={size} fill="#ffffff" />
      {matrix.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize + 0.1}
              height={cellSize + 0.1}
              fill="#1e1b4b"
            />
          ) : null
        )
      )}
    </svg>
  );
};
