import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ROUTES } from "../../lib/route"
import { apiService } from "../../services/axiosService"
import { sessionLogout } from "../../lib/utils"

export type User = {
  id: string
  name: string
  email: string
  hasPreferences: boolean
}

export interface UserState {
  user: User | null
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
}

// Signin User
export const loginUser = createAsyncThunk(
  "user/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await apiService.post(ROUTES.LoginRoute, credentials)
      return data
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "message" in error) {
        return rejectWithValue((error as { message: string }).message)
      }
      return rejectWithValue("Login failed due to an unknown error")
    }
  }
)

// Signup User
export const signupUser = createAsyncThunk(
  "user/signup",
  async (
    userData: {
      firstName: string
      lastName: string
      email: string
      password: string
      confirmPassword: string
    },
    { rejectWithValue }
  ) => {
    try {
      const data = await apiService.post(ROUTES.RegisterRoute, userData)
      return data
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "message" in error) {
        return rejectWithValue((error as { message: string }).message)
      }
      return rejectWithValue("Signup failed due to an unknown error")
    }
  }
)

// Logout User
export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get(ROUTES.LogoutRoute)
      sessionLogout(false)
      return response
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "message" in error) {
        return rejectWithValue((error as { message: string }).message)
      }
      return rejectWithValue("Signup failed due to an unknown error")
    }
  }
)

// Setup Preferences
export const setupPreferences = createAsyncThunk(
  "user/setup-preferences",
  async (
    reqData: { userName: string; preferences: string[] },
    { rejectWithValue }
  ) => {
    try {
      const data = await apiService.post(ROUTES.PreferenceRoute, reqData)
      return data
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "message" in error) {
        return rejectWithValue((error as { message: string }).message)
      }
      return rejectWithValue("Preferences setup failed due to an unknown error")
    }
  }
)

// User Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    renderInitialState: (state) => {
      state.error = null
      state.loading = false
    },
    checkLocalStorage: (state) => {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        state.user = JSON.parse(storedUser)
        state.loading = false
        state.error = null
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload
        state.loading = false
        localStorage.setItem("user", JSON.stringify(action.payload))
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(signupUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.error = action.payload as string
        state.loading = false
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false
        state.error = null
        state.user = null
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(setupPreferences.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        setupPreferences.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false
          state.user = action.payload
          localStorage.setItem("user", JSON.stringify(action.payload))
        }
      )
      .addCase(setupPreferences.rejected, (state, action) => {
        state.error = action.payload as string
        state.loading = false
      })
  },
})

// Export Reducer and Actions
export const { renderInitialState, checkLocalStorage } = userSlice.actions
export const userReducer = userSlice.reducer
