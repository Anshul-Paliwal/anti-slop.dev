import { BaseSkill } from './base-skill';

export class UIVibeSkill extends BaseSkill {
    readonly name = 'UI/UX Vibe Detector';
    readonly category = 'UI/UX';
    readonly description = 'Detects AI-generated UI patterns that lack user-centric design';

    getPrompt(code: string, fileName: string): string {
        return `Analyze this UI code for AI-generated anti-patterns that show lack of real UX consideration:

File: ${fileName}

Code:
\`\`\`
${code}
\`\`\`

Focus on these VIBE-CODED UI PATTERNS:

1. **Generic Component Names**:
   - "Button", "Card", "Container", "Wrapper" without context
   - "handleClick", "onClick", "handleChange" everywhere
   - "data", "item", "value", "result" as prop names
   - Missing semantic meaning (what does this button DO?)

2. **Accessibility Theater**:
   - aria-label="button" or aria-label="image" (useless labels)
   - alt="" or alt="image" on important images
   - Missing keyboard navigation
   - No focus management
   - Color contrast not considered
   - Screen reader experience ignored

3. **Copy-Paste Component Structure**:
   - Every component has same structure (useState, useEffect, return)
   - Unnecessary wrapper divs everywhere
   - No composition, everything inline
   - Props drilling 5+ levels deep
   - No custom hooks for shared logic

4. **Loading/Error State Slop**:
   - Generic "Loading..." or "Error occurred" messages
   - No loading skeletons or progressive disclosure
   - Errors that don't help users recover
   - Missing empty states
   - No retry mechanisms

5. **Responsive Design Neglect**:
   - Hardcoded pixel values everywhere
   - No mobile considerations
   - Breaks on small/large screens
   - Missing viewport meta tags
   - Desktop-first assumptions

6. **Form Vibe Patterns**:
   - No validation feedback
   - Submit button always enabled
   - No field-level error messages
   - Missing required field indicators
   - Generic "Please fill out this field"

7. **Performance Ignorance**:
   - Re-rendering everything on every state change
   - No memoization where obvious
   - Inline function definitions in render
   - Unoptimized images
   - No lazy loading

8. **Style Chaos**:
   - Inline styles mixed with CSS classes randomly
   - Magic numbers (margin: 23px, padding: 17px)
   - No design system or tokens
   - Inconsistent spacing
   - Color hex codes hardcoded everywhere

Respond in JSON:
{
  "score": <0-1, confidence of vibe-coded UI>,
  "findings": [
    {
      "severity": "critical|high|medium|low",
      "pattern": "<pattern name>",
      "description": "<what's wrong>",
      "suggestion": "<user-centric fix>",
      "lineRange": { "start": <line>, "end": <line> }
    }
  ]
}

Remember: Good UI requires empathy and iteration, not AI templates.`;
    }
}
