# Refactoring Guide - Reusable Architecture

This document describes the new reusable architecture implemented for the project, following React best practices and modern patterns.

## Architecture Overview

### 1. Redux Toolkit Store Structure

**Location:** `src/store/`

The application now uses Redux Toolkit for state management with a centralized store structure:

```
store/
├── store.js              # Main store configuration
└── slices/
    ├── ventesSlice.js     # Sales management
    ├── achatsSlice.js     # Purchases management
    ├── clientsSlice.js    # Clients management
    ├── fournisseursSlice.js # Suppliers management
    ├── rhSlice.js         # HR management
    ├── paiementsSlice.js  # Payments management
    ├── depensesSlice.js   # Expenses management
    └── parametresSlice.js # Settings management
```

**Usage Example:**
```javascript
import { useSelector, useDispatch } from 'react-redux';
import { addAchat } from '../store/slices/achatsSlice';

function MyComponent() {
  const dispatch = useDispatch();
  const achats = useSelector((state) => state.achats.achats);

  const handleAdd = (data) => {
    dispatch(addAchat(data));
  };

  return <div>...</div>;
}
```

### 2. Custom Hooks

**Location:** `src/hooks/`

#### useTable
Manages table state including sorting, pagination, and selection.

```javascript
import { useTable } from '../hooks';

const {
  data,              // Paginated and sorted data
  currentPage,
  pageSize,
  totalPages,
  handlePageChange,
  handlePageSizeChange,
  sortBy,
  sortOrder,
  handleSort,
  selectedItems,
  handleSelectItem,
  handleSelectAll,
} = useTable(dataArray, { initialPageSize: 10, enableSelection: true });
```

#### useFilter
Filters data based on multiple criteria including search queries.

```javascript
import { useFilter } from '../hooks';

const {
  filteredData,
  filters,
  searchQuery,
  setFilter,
  setSearchQuery,
  clearAllFilters,
  hasActiveFilters,
} = useFilter(dataArray, { status: '', category: '' });
```

#### useModal
Manages modal state with data and type support.

```javascript
import { useModal } from '../hooks';

const {
  isOpen,
  modalData,
  modalType,
  openModal,
  closeModal,
} = useModal();

// Usage
openModal(data, 'edit');  // Opens modal with data and type
closeModal();             // Closes modal
```

#### useForm
Manages form state with validation support.

```javascript
import { useForm } from '../hooks';

const {
  values,
  errors,
  touched,
  isSubmitting,
  handleChange,
  handleBlur,
  handleSubmit,
  setFieldValue,
  resetForm,
  isValid,
} = useForm(
  initialValues,
  validationSchema,
  onSubmitHandler
);
```

#### useDebounce
Debounces a value to prevent excessive updates.

```javascript
import { useDebounce } from '../hooks';

const debouncedSearch = useDebounce(searchTerm, 500);
```

### 3. Reusable Components

**Location:** `src/components/common/`

#### DataTable
Reusable data table with sorting and selection.

```javascript
import { DataTable } from '../components/common';

<DataTable
  columns={columns}
  data={tableData}
  sortBy={sortBy}
  sortOrder={sortOrder}
  onSort={handleSort}
  enableSelection={true}
  selectedItems={selectedItems}
  onSelectItem={handleSelectItem}
  onSelectAll={handleSelectAll}
  emptyMessage="No data found"
/>
```

#### TableContainer
Complete table with pagination wrapper.

```javascript
import { TableContainer } from '../components/common';

<TableContainer
  columns={columns}
  data={data}
  currentPage={currentPage}
  totalPages={totalPages}
  pageSize={pageSize}
  onPageChange={handlePageChange}
  onPageSizeChange={handlePageSizeChange}
  totalItems={totalItems}
/>
```

#### Button
Reusable button with variants and sizes.

```javascript
import { Button } from '../components/common';

<Button variant="primary" size="md" icon={Plus} onClick={handleClick}>
  Click me
</Button>

// Variants: primary, secondary, danger, success, ghost, outline
// Sizes: sm, md, lg
```

#### Input, Select, Textarea
Form input components with error handling.

```javascript
import { Input, Select, Textarea } from '../components/common';

<Input
  label="Name"
  value={value}
  onChange={handleChange}
  error={error}
  icon={User}
/>

<Select
  label="Category"
  options={[{ value: '1', label: 'Option 1' }]}
  value={value}
  onChange={handleChange}
/>

<Textarea
  label="Description"
  value={value}
  onChange={handleChange}
  rows={4}
/>
```

#### Card, StatCard
Card components for displaying content.

```javascript
import { Card, StatCard } from '../components/common';

<Card title="Title" subtitle="Subtitle" icon={Icon}>
  Content here
</Card>

<StatCard
  title="Total Sales"
  value="$10,000"
  change="+5%"
  changeType="positive"
  icon={DollarSign}
/>
```

#### Badge
Status badge component.

```javascript
import { Badge } from '../components/common';

<Badge status="Payé" />
<Badge status="En attente" />
```

#### Modal
Reusable modal component.

```javascript
import { Modal } from '../components/common';

<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Modal Title"
  size="md"
>
  Modal content
</Modal>

// Sizes: sm, md, lg, xl, full
```

#### Tabs
Tab navigation component.

```javascript
import { Tabs } from '../components/common';

<Tabs
  tabs={[
    { id: 'tab1', label: 'Tab 1' },
    { id: 'tab2', label: 'Tab 2', icon: Icon },
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>
```

#### FilterBar
Filter bar with multiple filters and search.

```javascript
import { FilterBar } from '../components/common';

<FilterBar
  filters={[
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      value: filters.status,
      options: statusOptions,
    },
  ]}
  onFilterChange={setFilter}
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  onClearFilters={clearAllFilters}
  hasActiveFilters={hasActiveFilters}
/>
```

### 4. Component Composition Pattern

The new architecture encourages breaking large components into smaller, focused sub-components:

**Example from AchatsRefactored.jsx:**

```javascript
// Sub-component: Form
const AchatForm = ({ onSubmit, onCancel, fournisseurs }) => {
  const { values, handleChange, handleSubmit } = useForm(initialValues, {}, onSubmit);
  return <form onSubmit={handleSubmit}>...</form>;
};

// Sub-component: Details Modal
const AchatDetailsModal = ({ achat, onClose, onPrint }) => {
  return <Modal>...</Modal>;
};

// Sub-component: Card
const FournisseurCard = ({ fournisseur, onViewDetails }) => {
  return <Card>...</Card>;
};

// Main component
export default function AchatsRefactored() {
  // Hooks and state
  // Render composed components
  return (
    <div>
      <Header />
      <Tabs />
      <FilterBar />
      <TableContainer />
      <Modal />
    </div>
  );
}
```

### 5. Migration Guide

To refactor an existing module to use the new architecture:

1. **Create Redux slice** (if not exists)
   - Define initial state
   - Create reducers for CRUD operations
   - Export actions and reducer

2. **Replace local state with Redux**
   - Remove useState for data that should be in Redux
   - Use useSelector to read data
   - Use useDispatch to update data

3. **Replace custom logic with hooks**
   - Use useTable for table state
   - Use useFilter for filtering
   - Use useModal for modal management
   - Use useForm for form handling

4. **Replace UI components**
   - Replace custom table with TableContainer
   - Replace buttons with Button component
   - Replace inputs with Input/Select components
   - Replace cards with Card component

5. **Break into sub-components**
   - Extract forms into separate components
   - Extract modals into separate components
   - Extract repeated UI patterns into components

### 6. Best Practices

- **Single Responsibility:** Each component/hook should do one thing well
- **Composition over Inheritance:** Compose components together rather than extending them
- **Immutable Updates:** Use Redux Toolkit's Immer for immutable state updates
- **Type Safety:** Consider adding TypeScript for better type checking
- **Performance:** Use React.memo for expensive components
- **Error Handling:** Implement proper error boundaries and error states
- **Loading States:** Show loading indicators during async operations
- **Accessibility:** Ensure components are keyboard navigable and screen reader friendly

### 7. Example: Complete Module Refactor

See `AchatsRefactored.jsx` for a complete example of a refactored module using:
- Redux for state management
- Custom hooks for logic
- Reusable components for UI
- Component composition for organization

### 8. Next Steps

To complete the refactoring:

1. Refactor `Ventes.jsx` following the same pattern
2. Refactor `RH.jsx` following the same pattern
3. Refactor `Paiements.jsx` following the same pattern
4. Refactor `Depenses.jsx` following the same pattern
5. Refactor remaining modules
6. Remove old context provider once all modules are migrated to Redux
7. Add TypeScript for type safety (optional)
8. Add unit tests for hooks and components
9. Add integration tests for Redux slices

## File Structure

```
src/
├── components/
│   ├── common/           # Reusable UI components
│   ├── print/            # Print templates
│   └── ui/               # Legacy UI components (to be migrated)
├── hooks/                # Custom hooks
├── modules/              # Feature modules
├── store/                # Redux store and slices
├── context/              # React context (legacy, to be migrated)
└── App.jsx              # Main app with Redux Provider
```

## Benefits of This Architecture

1. **Reusability:** Components and hooks can be used across modules
2. **Maintainability:** Smaller, focused components are easier to maintain
3. **Scalability:** Easy to add new features following established patterns
4. **Testability:** Isolated components and hooks are easier to test
5. **Consistency:** Unified UI patterns across the application
6. **Performance:** Optimized with memoization and efficient state management
7. **Developer Experience:** Clear structure and patterns speed up development
