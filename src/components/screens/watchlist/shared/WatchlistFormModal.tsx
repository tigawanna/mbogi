import { useSnackbarStore } from "@/components/react-native-paper/snackbar/global-snackbar-store";
import { pb, pocketbaseFriendlyUUID } from "@/lib/pb/client";
import { WatchlistCreateSchema, WatchlistResponse } from "@/lib/pb/types/pb-zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Divider,
  HelperText,
  Modal,
  Portal,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import { z } from "zod";

// Local form schema overriding title to be required
const FormSchema = WatchlistCreateSchema.extend({
  title: z.string().min(1, "Title is required"),
  overview: z.string().optional(),
  visibility: z.enum(["public", "private", "followers_only"]),
  id: z.string().optional(), // Optional for new watchlists, required for updates
  user_id: z.string().nonempty("User ID is required"),
});

type FormData = z.infer<typeof FormSchema>;

interface WatchlistFormModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (data: FormData) => void;
  initialValues?: Partial<WatchlistResponse>;
  submitLabel?: string;
  isMutationPending?: boolean;
}

export function WatchlistFormModal({
  visible,
  onDismiss,
  onSubmit,
  initialValues,
  isMutationPending,
  submitLabel = "Save",
}: WatchlistFormModalProps) {
  // console.log(" == initial values  ==", initialValues);
  const { colors } = useTheme();
  const { showSnackbar } = useSnackbarStore();
  const currentUserId = pb.authStore?.record?.id;
  const visibilityOptions = [
    { label: "🌍 Public", value: "public" },
    { label: "🔒 Private", value: "private" },
    { label: "👥 Followers Only", value: "followers_only" },
  ];
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      overview: "",
      visibility: "public",
      id: initialValues?.id ?? pocketbaseFriendlyUUID(),
      user_id: currentUserId,
    },
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    if (visible) {
      // Check if user is logged in
      if (!currentUserId) {
        showSnackbar("You must be logged in to create a watchlist.", {
          duration: 10_000,
        });
        return;
      }

      // Reset form when modal opens
      reset({
        // id: initialValues?.id ?? pocketbaseFriendlyUUID(),
        user_id: currentUserId,
        title: initialValues?.title || "",
        overview: initialValues?.overview || "",
        visibility: initialValues?.visibility || "public",
      });
    }
  }, [visible, initialValues, reset, currentUserId, showSnackbar]);
  // console.log("states ==>> ", {isValid, isValidating, isSubmitting});
  const disableButton = !isValid;
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[styles.container, { backgroundColor: colors.surface }]}>
        <View style={styles.header}>
          <Text variant="titleLarge" style={[styles.title, { color: colors.onSurface }]}>
            {initialValues ? "Edit Watchlist" : "Create New Watchlist"}
          </Text>
          <Divider style={styles.divider} />
        </View>

        <View style={styles.content}>
          <View style={styles.field}>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TextInput
                    label="Watchlist Title"
                    mode="outlined"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={!!errors.title}
                    style={styles.input}
                  />
                  {errors.title && (
                    <HelperText type="error" style={styles.errorText}>
                      {errors.title.message}
                    </HelperText>
                  )}
                </>
              )}
            />
          </View>

          <View style={styles.field}>
            <Controller
              control={control}
              name="overview"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TextInput
                    label="Description (Optional)"
                    mode="outlined"
                    multiline
                    numberOfLines={3}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={!!errors.overview}
                    style={styles.input}
                  />
                  {errors.overview && (
                    <HelperText type="error" style={styles.errorText}>
                      {errors.overview.message}
                    </HelperText>
                  )}
                </>
              )}
            />
          </View>

          <View style={styles.field}>
            <Controller
              control={control}
              name="visibility"
              render={({ field: { onChange, value } }) => (
                <>
                  <Dropdown
                    label="Visibility"
                    placeholder="Select visibility"
                    options={visibilityOptions}
                    value={value}
                    onSelect={onChange}
                    mode="outlined"
                    error={!!errors.visibility}
                  />
                  {errors.visibility && (
                    <HelperText type="error" style={styles.errorText}>
                      {errors.visibility.message}
                    </HelperText>
                  )}
                </>
              )}
            />
          </View>
        </View>

        <View style={styles.actions}>
          <Button mode="outlined" onPress={onDismiss} style={[styles.button, styles.cancelButton]}>
            Cancel
          </Button>
          <Button
            mode="contained"
            disabled={disableButton}
            onPress={handleSubmit(onSubmit)}
            style={[styles.button, styles.submitButton]}>
            {submitLabel}
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderRadius: 16,
    maxHeight: "80%",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  divider: {
    marginTop: 8,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  field: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: "transparent",
  },
  errorText: {
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 8,
  },
  cancelButton: {
    marginRight: 6,
  },
  submitButton: {
    marginLeft: 6,
  },
});
