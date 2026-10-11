# Component API (built from DESIGN.md §4)

Import from `@/components/ui` unless noted. `<main>` has no padding: wrap each page in `<Container>`. Icons come from lucide-react; the stroke width is set globally, so don't pass a `strokeWidth` prop.

## Actions and layout
- `Button({variant?:'primary'|'secondary'|'ghost'|'danger-ghost'|'link', size?:'sm'|'md'|'lg', loading?, fullWidth?, iconStart?, iconEnd?, iconOnly? (needs aria-label), href? (renders Link), ...button})`
- `buttonClasses(opts)`
- `Container({...div})`

## Forms
- `Field({id, label?, optional?, helper?, error?, wrapperClassName?, children})`
- `Input({label?, optional?, helper?, error?, wrapperClassName?, h?: 9|10|11|14, ...input})`
- `Textarea({label?, optional?, helper?, error?, wrapperClassName?, ...textarea})`: same as Input, without `h`.
- `Select({label?, optional?, helper?, error?, wrapperClassName?, h?, ...select})`: same as Input, with `<option>` children.
- `controlClasses({height?, invalid?, className?})`
- `Checkbox({label, ...input})`
- `Switch({checked, onCheckedChange, label, disabled?})`
- `RadioCard({name, value, checked, onChange, children, className?})`: put `pe-8` on the content's first line, because the check icon sits at the top-end corner.

## Badges and prices
- `Badge({kind?:'neutral'|'accent'|'sale'|'success'|'warning'|'danger'})`
- `OrderStatusBadge({status, label?})`
- `Price({price, finalPrice, discountPercent, size?:'card'|'pdp'|'line', available?})`

## Product pickers
- `ColorDots({colors})`
- `ColorSwatch({color, selected?, unavailable?, size?:'md'|'sm', onClick})`
- `SizeChip({size, selected?, soldOut?, compact?, onClick})`
- `QtyStepper({value, onChange, min?, max?, onRemove?, pending?})`: at `min`, the minus button becomes a trash button when `onRemove` is set.

## Feedback
- `useToast()` returns `{success, error, info}(message, {action?:{label, href}})`. The provider is already mounted.
- `InlineAlert({kind?:'info'|'error'|'success'|'warning', icon?, action?, children})`
- `EmptyState({icon: LucideIcon, title, body?, action?, tileClassName?})`
- `Skeleton({className})`, `PdpSkeleton()`, `CartLineSkeleton()`, `OrderRowSkeleton()`

## Navigation and overlays
- `Pagination({page, pageCount, hrefFor? | onPageChange?})`
- `Breadcrumb({items: {label, href?}[]})`
- `SectionHeader({title, href?, actions?})`
- `Drawer({open, onClose, side?:'start'|'bottom', labelledBy?, ariaLabel?, className?, children})`: focus trap, Escape to close, scroll lock.

## Outside `ui`, in `src/components/`
- `Logo({className?})`
- `useCategories(): Category[]`
- `Header()` and `Footer()`: no props.
- `ProductCard({product, priority?, variant?:'grid'|'rail', onWishlistChange?(product, wished), className?})`. For a rail, use `<ul className="rail ...">` with `<li className="contents">`.
- `ProductGrid({products, layout?:'home'|'three'|'four', priorityCount?, itemClassName?(i), onWishlistChange?, className?})`: renders nothing for an empty list.
- `productGridClasses(layout)`
- `ProductCardSkeleton()` and `ProductGridSkeleton({count?, layout?, className?})`, in `ProductSkeletons.tsx`.

## Libraries
- `formatPrice`, `formatNumber`, `toPersianDigits`, `normalizePhone`, `isValidPhone` from `@/lib/format`
- `cn` from `@/lib/cn`
- `api` from `@/lib/api`
- Stores: `useAuthStore`, `useCartStore` / `useCartView()`, `useWishlistStore`
