import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./ClientSearch.module.scss";

export type Client = {
  id: string;
  name: string;
};

export type ClientSearchProps = {
  value: string;
  onChange: (value: string) => void;
  onAddClient?: () => void;
  onSelectClient: (client: Client) => void;
  placeholder?: string;
  buttonText?: string;
};

export function ClientSearch({
  value = "",
  onChange = () => {},
  onAddClient = () => {},
  onSelectClient,
  placeholder = "Buscar cliente",
  buttonText = "Agregar",
}: ClientSearchProps) {
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const debounceTimer = useRef<ReturnType<typeof setTimeout>>();
  const controller = useRef<AbortController | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const debouncedSearch = async (value: string) => {
      clearTimeout(debounceTimer.current);
      controller?.current?.abort();
      controller.current = new AbortController();

      debounceTimer.current = setTimeout(async () => {
        try {
          const response = await fetch(`/api/customers/search?name=${value}`, {
            method: "GET",
            signal: controller.current?.signal,
          });
          const data = await response.json();
          if (data.status === "success")
            setSearchResults(() => {
              return data.customers.map((client: any) => ({
                id: client.id,
                name: client.nombre,
              }));
            });
        } catch (error) {}
      }, 500);
    };

    debouncedSearch(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectClient = (client: Client) => {
    if (!onSelectClient) return;

    onSelectClient(client);
    onChange(client.name);
    setIsDropdownVisible(false);
  };

  return (
    <div className={styles.clientSearch}>
      <div className={styles.inputWrapper}>
        <input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={styles.input}
          onFocus={() => setIsDropdownVisible(true)}
        />
        <div
          ref={dropdownRef}
          className={styles.dropdown}
          style={{
            display: isDropdownVisible ? "block" : "none",
          }}
        >
          {searchResults.length > 0 ? (
            searchResults.map((client) => (
              <div
                key={client.id}
                className={styles.dropdownItem}
                onClick={() => handleSelectClient(client)}
              >
                {client.name}
              </div>
            ))
          ) : (
            <div className={styles.dropdownItem}>Sin resultados</div>
          )}
        </div>
      </div>
      <button className={styles.button} onClick={onAddClient}>
        {buttonText}
      </button>
    </div>
  );
}
