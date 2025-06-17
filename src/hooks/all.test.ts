import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useGetCollectionNames } from "./useGetCollectionNames";
import { useSimulateContract, UseSimulateContractReturnType } from "wagmi";

// Mock de wagmi
vi.mock("wagmi", () => ({
  useSimulateContract: vi.fn(),
}));

describe("useGetCollectionNames", () => {
  const mockContractAddress = "0x1234567890123456789012345678901234567890";
  const mockCollectionNames = ["Colección 1", "Colección 2"];

  beforeEach(() => {
    vi.resetAllMocks();
  });

  const renderUseGetCollectionNames = () =>
    renderHook(() => useGetCollectionNames(mockContractAddress));

  it("debería devolver los nombres de las colecciones correctamente", async () => {
    vi.mocked(useSimulateContract).mockReturnValue({
      data: mockCollectionNames as any,
      status: "success",
      isSuccess: true,
      isLoading: false,
      isError: false,
      error: null,
    } as UseSimulateContractReturnType);

    const { result } = renderUseGetCollectionNames();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.collectionNames).toEqual(mockCollectionNames);
    });

    expect(useSimulateContract).toHaveBeenCalledWith({
      address: mockContractAddress,
      abi: expect.any(Array), // Asumimos que MetasuyoABI es un array
      functionName: "getCollectionNames",
    });
  });

  it("debería manejar el estado de carga correctamente", () => {
    vi.mocked(useSimulateContract).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as UseSimulateContractReturnType);

    const { result } = renderUseGetCollectionNames();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.collectionNames).toBeUndefined();
  });

  it("debería manejar errores correctamente", () => {
    const mockError = new Error("Error de simulación");
    vi.mocked(useSimulateContract).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: mockError,
    } as UseSimulateContractReturnType);

    const { result } = renderUseGetCollectionNames();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(mockError);
    expect(result.current.collectionNames).toBeUndefined();
  });
});
