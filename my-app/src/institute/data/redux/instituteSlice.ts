import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { InstituteService } from '../apiservices/institute.service';
import { Institute } from '../../interfaces/Institute';

interface InstituteState {
  institutes: Institute[];
  currentInstitute: Institute | null;
  loading: boolean;
  error: string | null;
}

const initialState: InstituteState = {
  institutes: [],
  currentInstitute: null,
  loading: false,
  error: null,
};

// Thunks
export const fetchInstitutes = createAsyncThunk(
  'institute/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await InstituteService.getAllInstitutes();
      return response.data; // Assuming PaginatedResponse.data is the array
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch institutes');
    }
  }
);

export const fetchInstituteById = createAsyncThunk(
  'institute/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await InstituteService.getInstituteById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch institute');
    }
  }
);

export const createInstitute = createAsyncThunk(
  'institute/create',
  async (data: Partial<Institute>, { rejectWithValue }) => {
    try {
      const response = await InstituteService.createInstitute(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create institute');
    }
  }
);

export const updateInstitute = createAsyncThunk(
  'institute/update',
  async ({ id, data }: { id: string; data: Partial<Institute> }, { rejectWithValue }) => {
    try {
      const response = await InstituteService.updateInstitute(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update institute');
    }
  }
);

export const deleteInstitute = createAsyncThunk(
  'institute/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await InstituteService.deleteInstitute(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete institute');
    }
  }
);

const instituteSlice = createSlice({
  name: 'institute',
  initialState,
  reducers: {
    clearCurrentInstitute: (state) => {
      state.currentInstitute = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchInstitutes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstitutes.fulfilled, (state, action) => {
        state.loading = false;
        state.institutes = action.payload;
      })
      .addCase(fetchInstitutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch By Id
      .addCase(fetchInstituteById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstituteById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInstitute = action.payload;
      })
      .addCase(fetchInstituteById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createInstitute.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInstitute.fulfilled, (state, action) => {
        state.loading = false;
        state.institutes.push(action.payload);
      })
      .addCase(createInstitute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update
      .addCase(updateInstitute.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInstitute.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.institutes.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          state.institutes[index] = action.payload;
        }
        state.currentInstitute = action.payload;
      })
      .addCase(updateInstitute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete
      .addCase(deleteInstitute.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInstitute.fulfilled, (state, action) => {
        state.loading = false;
        state.institutes = state.institutes.filter(i => i.id !== action.payload);
      })
      .addCase(deleteInstitute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearCurrentInstitute, clearError } = instituteSlice.actions;
export default instituteSlice.reducer;
