import React, { useEffect, useState } from "react"
import { FormGeneratorProps } from "../components/form-generator"
import {
  TUserSetting,
  useGetUserDetailQuery,
  useUpdateUserDetailsMutation,
} from "../redux/slice/user-detail-slice"
import { showToast } from "../lib/utils"

const useSetting = () => {
  const { data } = useGetUserDetailQuery()
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateUserDetailsMutation()
  const [formData, setFormData] = useState<TUserSetting>({} as TUserSetting)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({
    firstName: "First Name is required",
    lastName: "Last Name is required",
    email: "Email is required",
    phone: "Phone is required",
  })

  // Set the initial state based on the user details and update the form errors state
  useEffect(() => {
    if (data) setFormData(data)
    setFormErrors((prev) => {
      const updatedErrors = { ...prev }
      if (data?.firstName) delete updatedErrors.firstName
      if (data?.lastName) delete updatedErrors.lastName
      if (data?.email) delete updatedErrors.email
      if (data?.phone) delete updatedErrors.phone
      return updatedErrors
    })
  }, [data])

  // Handle Update Profile and Update Form Errors
  const handleUpdate = (
    name: string,
    value: string | boolean | string[] | null,
    error: string | null
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Store error only if it exists, otherwise remove it
    setFormErrors((prev) => {
      const updatedErrors = { ...prev }
      if (error) updatedErrors[name] = error
      else delete updatedErrors[name]
      return updatedErrors
    })
  }

  // Handle Update Profile using RTK Query
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault()
      if (Object.keys(formErrors).length > 0) {
        console.log("Form has errors:", formErrors)
        return
      }

      await updateProfile(formData).unwrap()
      showToast("Profile updated successfully", "success")
    } catch (error) {
      console.log("Error updating profile:", error)
    }
  }

  // Form Elements for Setting Form (using Dynamic Form Generator)
  const SETTING_FORM_ELEMENTS: FormGeneratorProps[] = [
    {
      inputType: "input",
      type: "text",
      label: "First Name",
      placeholder: "Enter your first name",
      name: "firstName",
      hasRequiredMark: true,
      error: formErrors.firstName,
      defaultValue: formData.firstName,
      onUpdate: handleUpdate,
      validation: {
        required: true,
        minLength: 2,
        maxLength: 20,
        pattern: /^[a-zA-Z\s]+$/,
        errorMessage: "Only Alphabets are allowed",
      },
    },
    {
      inputType: "input",
      type: "text",
      label: "Last Name",
      placeholder: "Enter your last name",
      name: "lastName",
      error: formErrors.lastName,
      defaultValue: formData.lastName,
      hasRequiredMark: true,
      onUpdate: handleUpdate,
      validation: {
        required: true,
        minLength: 2,
        maxLength: 20,
        pattern: /^[a-zA-Z\s]+$/,
        errorMessage: "Only Alphabets are allowed",
      },
    },
    {
      inputType: "input",
      type: "email",
      label: "Email",
      placeholder: "Enter your email",
      name: "email",
      defaultValue: formData.email,
      hasRequiredMark: true,
      error: formErrors.email,
      onUpdate: handleUpdate,
      validation: {
        required: true,
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      },
    },
    {
      inputType: "input",
      type: "tel",
      label: "Phone",
      placeholder: "Enter your contact number",
      name: "phone",
      error: formErrors.phone,
      defaultValue: formData.phone,
      onUpdate: handleUpdate,
      hasRequiredMark: true,
      validation: {
        required: true,
        minLength: 10,
        maxLength: 10,
        pattern: /^[0-9]{10}$/,
      },
    },
    {
      inputType: "input",
      type: "password",
      label: "Password",
      placeholder: "Enter your password",
      name: "password",
      hasRequiredMark: true,
      error: formErrors.password,
      onUpdate: handleUpdate,
      validation: {
        required: false,
        minLength: 6,
        maxLength: 20,
        pattern:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
        errorMessage:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      },
    },
    {
      inputType: "input",
      type: "password",
      label: "Confirm Password",
      placeholder: "Confirm your password",
      name: "confirmPassword",
      error: formErrors.confirmPassword,
      hasRequiredMark: true,
      onUpdate: handleUpdate,
      validation: {
        required: false,
        minLength: 6,
        maxLength: 20,
        pattern:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
        errorMessage:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
        validate: (value) => {
          if (value !== formData.password) return "Passwords do not match."
          return null
        },
      },
    },
  ] as const

  return {
    handleUpdate,
    formData,
    formErrors,
    SETTING_FORM_ELEMENTS,
    handleSubmit,
    isUpdating,
  }
}

export default useSetting
