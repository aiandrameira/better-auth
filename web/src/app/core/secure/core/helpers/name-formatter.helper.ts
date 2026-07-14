/**
 * Extrai o primeiro nome de um nome completo.
 */
export function getFirstName(fullName?: string): string {
    if (!fullName) return "";
    return fullName.trim().split(" ")[0] || "";
}

/**
 * Retorna o primeiro e segundo nome, mantendo preposições (de, da, dos, das, do, e)
 */
export function getDisplayName(fullName?: string): string {
    if (!fullName) return "";
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0];
    const preps = ["de", "da", "das", "do", "dos", "e"];
    if (parts.length > 2 && preps.includes(parts[1].toLowerCase())) {
        return `${parts[0]} ${parts[1]} ${parts[2]}`;
    }
    return `${parts[0]} ${parts[1]}`;
}

/**
 * Retorna as iniciais do primeiro nome e do sobrenome.
 * Ex: "Aiandra Alves" => "AA", "Aiandra Meira" => "AM"
 */
export function getInitials(fullName?: string): string {
    if (!fullName) return "";
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || "";
    const first = parts[0][0]?.toUpperCase() || "";
    const last = parts[parts.length - 1][0]?.toUpperCase() || "";
    return `${first}${last}`;
}
