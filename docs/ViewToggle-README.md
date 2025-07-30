// ViewToggle Component Documentation

The ViewToggle component now supports three variants for different use cases:

## Variants

### 1. `buttons` (default)
- Shows two separate icon buttons for grid and list views
- Good for: Main content areas, prominent view switching
- Usage:
```tsx
<ViewToggle
  viewMode={viewMode}
  onViewModeChange={setViewMode}
  variant="buttons"
/>
```

### 2. `segmented`
- Shows a segmented control with labels
- Good for: Settings pages, explicit preference selection
- Usage:
```tsx
<ViewToggle
  viewMode={viewMode}
  onViewModeChange={setViewMode}
  variant="segmented"
/>
```

### 3. `menu` (new)
- Shows a single icon button that opens a dropdown menu
- Good for: Compact header areas, toolbars with limited space
- Usage:
```tsx
<ViewToggle
  viewMode={viewMode}
  onViewModeChange={setViewMode}
  variant="menu"
/>
```

## Implementation Details

### Menu Variant Features:
- Single icon button showing current view mode (grid or list icon)
- Opens a dropdown menu with "Grid View" and "List View" options
- Uses React Native Paper's Menu component
- Automatically closes menu after selection
- Positioned below the anchor button (`anchorPosition="bottom"`)

### Current Usage in App:
- **Discover Screen**: Uses `menu` variant in the header search bar for space efficiency
- **Individual Screens**: Can use `buttons` or `segmented` variants as needed

### Store Integration:
All variants work seamlessly with the view preferences store:
- `useDiscoverMoviesViewMode()` for movie lists
- `useDiscoverTVViewMode()` for TV show lists
- `useSearchPersonViewMode()` for person search results

### Example Full Integration:
```tsx
import { ViewToggle } from '@/components/shared/ViewToggle';
import { useDiscoverMoviesViewMode } from '@/store/view-preferences-store';

function MyScreen() {
  const { viewMode, setViewMode } = useDiscoverMoviesViewMode();
  
  return (
    <View>
      {/* Compact header version */}
      <ViewToggle
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        variant="menu"
      />
      
      {/* Or full buttons version */}
      <ViewToggle
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        variant="buttons"
      />
      
      {/* Your content with viewMode prop */}
      <MyFlatList viewMode={viewMode} />
    </View>
  );
}
```
