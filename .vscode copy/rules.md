This is a react native expo app using typescript
- react native paper for theming and components , adhere to `useTheme` and restrain from inlining colors unless absolutely necessary
- pnpm for package management, use `pnpm install` to add new packages
- react native svg for icons and svgs, use `react-native-svg` package

- zod for validation schemas, use `z.object({...})` for defining schemas and `zodResolver` from `@hookform/resolvers/zod` for integrating with forms
- react hook form for forms, use `useForm` and `Controller` from `react-hook-form`, ensure to use `zod` for validation schemas

- with react query prefer createing `queryOptions` and or custom hooks to encapsulate logic
 - Do not nest a `Flatlist` in a `ScrollView`
 - the route components in /app should be kept short not more than 25 lines of code move the rest into the appropriate components folder
- most of the screens in the tab have safe area padding when using headerShown:true 

in some cases i want to hide the header when it's ot relevent, use `headerShown: false` in the navigation options , this includes screens outside the tab navigator and even in the navigatior sould you have a screen witha a searchbox and flatlist prefer to use `headerShown: false` and implement the searchbox in the screen itself also add
```tsx
  const { top } = useSafeAreaInsets();
      <View style={{ flex: 1, paddingTop: top }}>
```
type of manual safe area view addition

- prefre the `@/` alias for most things including images in the /assets folder with `require("@/assets....)`, this is configured in the tsconfig.json file
