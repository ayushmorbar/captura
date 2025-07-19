# Captura API Reference

## Components
- All UI components are documented with props and usage examples
- See `components/` directory for source code

## Hooks
- Custom hooks are in `hooks/`
- Each hook is documented with usage and return types

## Utilities
- Utility functions are in `lib/`
- Each utility is documented with JSDoc comments

## Example: RecordingControls
```tsx
import RecordingControls from "../components/recording-controls"

<RecordingControls
  onStart={handleStart}
  onPause={handlePause}
  onStop={handleStop}
/>
```

## Example: useRecording
```tsx
import { useRecording } from "../hooks/use-recording"

const { start, pause, stop, isRecording } = useRecording()
```

## More
- For full API details, see inline JSDoc comments and prop types in source files
- Open an issue for undocumented features
