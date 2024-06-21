/**
 * 找出两个数组中不相同的值并返回
 * @param {Array} arr1
 * @param {Array} arr2
 * @returns 处理后的数组
 */
export function getDifferentItems(arr1, arr2) {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);

    const diff1 = arr1.filter((item) => !set2.has(item));
    const diff2 = arr2.filter((item) => !set1.has(item));

    return [...diff1, ...diff2];
}

/**
 * 找出两个数组中的相同项并返回
 * @param {Array} arr1
 * @param {Array} arr2
 * @returns
 */
export function getCommonItems(arr1, arr2) {
    const set1 = new Set(arr1);
    const commonItems = [...new Set(arr2.filter((item) => set1.has(item)))];
    return commonItems;
}

/**
 * 格式化时间
 * @param {(Object|string|number)} time
 * @param cformat
 * @yearsOld
 * @returns {string | null | number}
 * 格式化时间
 */

export function parseTime(time, cFormat, yearsOld) {
    if (arguments.length === 0) {
        return null;
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
    const years = yearsOld || 0;
    let date;
    if (typeof time === 'object') {
        date = time;
    } else {
        if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
            time = parseInt(time);
        }
        if (typeof time === 'number' && time.toString().length === 10) {
            time = time * 1000;
        }
        date = new Date(time);
    }
    const formatObj = {
        y: date.getFullYear() + years,
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay(),
    };
    const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key];
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') {
            return ['日', '一', '二', '三', '四', '五', '六'][value];
        }
        return value.toString().padStart(2, '0');
    });
    return time_str;
}

/**
 * 并发控制函数
 * @param {*} tasks
 * @param {*} concurrency
 * @returns
 */
export async function executeTasksInBatches(tasks, concurrency) {
    let index = 0;
    const results = [];

    while (index < tasks.length) {
        // 从指定下标处开始取出并发量个任务
        const batch = tasks.slice(index, index + concurrency);
        // 用 Promise.all 来并行执行这一批任务
        const batchResults = await Promise.all(batch);
        console.log('并发下标:  ', index, '====', '并发任务队列回调:  ', batchResults);
        // 将这一批任务的结果添加到总结果数组中
        results.push(...batchResults);
        // 更新下标，准备处理下一批任务
        index += concurrency;
    }

    return results;
}

/**
 * 格式化数字    1000 =》 1K
 * @param num 需要格式化的数字
 * @returns {*|string} 格式化后的数字
 */
export function parseNum(num) {
    if (!num || num === '' || num === null || num === undefined) {
        return '0';
    }

    // 修正并简化条件分支
    if (num >= 10000000) {
        // 千万及以上
        num = (num / 1000000).toFixed(2) + 'M'; // 使用'M'表示百万
    } else if (num >= 10000) {
        // 一万至一百万
        num = (num / 10000).toFixed(2) + (num >= 10000 ? 'W' : 'K'); // 区分万和千的处理
    } else {
        num = Math.floor(num); // 对于小于1万的数字，直接取整返回
    }

    return num;
}

/**
 * 去除对象中的空值并返回一个新对象
 * @param {Object} obj
 * @returns 处理后的对象
 */
export function removeEmptyValues(obj) {
    // 创建一个新的对象，用于存储非空值的键值对
    let result = {};

    // 遍历对象的每个键值对
    for (let key in obj) {
        // 检查值是否为空
        if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
            // 如果值不为空，则将键值对添加到结果对象中
            result[key] = obj[key];
        }
    }

    // 返回处理后的对象
    return result;
}

/**
 * 获取当前的时区
 * @returns 获取到的时区
 */
export function getCurrentTimeZone() {
    // 获取当前时区的名称
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return timeZone;
}

/**
 *
 * @param {number} timestamp
 * @param {string} timeZone
 * @returns {string} 格式化后的时间
 */

export function formatTimestampToLocalTime(timestamp) {
    // 将时间戳转换为毫秒
    const date = new Date(timestamp * 1000);

    // 获取当前系统的时区和地区设置
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;

    // 格式化选项
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: timeZone,
        hour12: false, // 使用24小时制
    };

    // 使用Intl.DateTimeFormat进行格式化
    const formatter = new Intl.DateTimeFormat(locale, options);
    const formattedParts = formatter.formatToParts(date);

    // 组装格式化后的日期时间字符串
    const formattedDate = `
    ${formattedParts.find((part) => part.type === 'month').value}-${formattedParts.find((part) => part.type === 'day').value} ${formattedParts.find((part) => part.type === 'hour').value}:${
        formattedParts.find((part) => part.type === 'minute').value
    }:${formattedParts.find((part) => part.type === 'second').value}`;

    return formattedDate.trim();
}

/**
 * 该函数返回当前 Unix 时间戳和过去 7、15、30 天的 Unix 时间戳。
 *
 * @returns {Object} 包含当前 Unix 时间戳和过去 7、15、30 天的 Unix 时间戳的对象。
 * @returns {number} now - 当前 Unix 时间戳。
 * @returns {number} sevenDaysAgo - 7 天前的 Unix 时间戳。
 * @returns {number} fifteenDaysAgo - 15 天前的 Unix 时间戳。
 * @returns {number} thirtyDaysAgo - 30 天前的 Unix 时间戳。
 */
export function getCurrentAndPreviousTimestamps() {
    // 获取当前时间
    const currentDate = new Date();

    // 获取七天、十五天和三十天前的时间
    const daysAgo = (days) => new Date(currentDate.getTime() - days * 24 * 60 * 60 * 1000);

    const now = Math.floor(currentDate.getTime() / 1000);
    const sevenDaysAgo = Math.floor(daysAgo(7).getTime() / 1000);
    const fifteenDaysAgo = Math.floor(daysAgo(15).getTime() / 1000);
    const thirtyDaysAgo = Math.floor(daysAgo(30).getTime() / 1000);

    return { now, sevenDaysAgo, fifteenDaysAgo, thirtyDaysAgo };
}

/**
 * 该函数计算并返回过去 7、15、30 天的 Unix 时间戳。
 *
 * @param {number} timestamp - 要为其计算过去时间戳的 Unix 时间戳。
 * @returns {Object} 包含过去 7、15、30 天的 Unix 时间戳的对象。
 * @returns {number} sevenDaysAgo - 7 天前的 Unix 时间戳。
 * @returns {number} fifteenDaysAgo - 15 天前的 Unix 时间戳。
 * @returns {number} thirtyDaysAgo - 30 天前的 Unix 时间戳。
 */
export function getPastTimestamps(timestamp) {
    // 七天前的时间戳
    let sevenDaysAgo = timestamp - 7 * 24 * 60 * 60;

    // 十五天前的时间戳
    let fifteenDaysAgo = timestamp - 15 * 24 * 60 * 60;

    // 三十天前的时间戳
    let thirtyDaysAgo = timestamp - 30 * 24 * 60 * 60;

    return {
        sevenDaysAgo,
        fifteenDaysAgo,
        thirtyDaysAgo,
    };
}

/**
 * 将格式为 'YYYY-MM-DD' 的日期字符串转换为 Unix 时间戳（以秒为单位）。
 *
 * @param {string} dateString - 要转换的日期字符串。
 * @returns {number} 给定日期字符串的 Unix 时间戳（以秒为单位）。
 *
 * @throws 如果输入的 dateString 不是 'YYYY-MM-DD' 格式，将会抛出一个错误。
 */
export function convertToUnixTimestamp(dateString) {
    // 创建一个 Date 对象
    let date = new Date(dateString.replace(/-/g, '/'));
    // 返回 Unix 时间戳（秒）
    return Math.floor(date.getTime() / 1000);
}

/**
 *
 * @param {*} milliseconds
 * @returns
 */
export function convertMillisecondsToMMSS(milliseconds) {
    // 计算总秒数
    const totalSeconds = Math.floor(milliseconds / 1000);

    // 计算分钟和秒
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // 格式化为 mm:ss
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

export function convertVideoToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            resolve(e.target.result);
        };
        reader.onerror = () => {
            reject('');
        };
        reader.readAsDataURL(file);
    });
}

export async function taskQueue(queue_num = 50, task_list, cb) {
    const result = [];
    let index = 0;
    while (index < task_list.length) {
        const batchPromises = task_list.slice(index, index + queue_num).map((i, idx) => cb(i));
        const batchResults = await Promise.all(batchPromises);
        result.push(...batchResults);
        index += queue_num;
    }
    return result;
}

export function readeFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (event) {
            resolve(event.target.result);
        };
        reader.onerror = function (event) {
            reject(event.target.error);
        };
        reader.readAsText(file);
    });
}
