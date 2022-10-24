import dayjs from 'dayjs'

/**
 * Time format
 * @param {number} value
 * @param {string} type?
 */
export function formatDate(value, type = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(value).format(type)
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousand(num) {
  return (+num || 0)
    .toString()
    .replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}
