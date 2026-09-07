export function setMoneyFormat(value: number): string {
    return value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
}