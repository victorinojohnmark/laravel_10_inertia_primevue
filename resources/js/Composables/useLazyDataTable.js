import { ref, computed, onMounted } from 'vue';
import { router, usePage } from '@inertiajs/vue3';

export function useLazyDataTable(
    defaultFilters = {},
    only = ['request'],
    rows = 20
) {
    const page = usePage();

    const dataTableDefaults = {
        filters: defaultFilters,
        sortField: '',
        sortOrder: 1,
        currentPage: 1,
        rowsPerPage: rows,
    };

    const filters = ref(dataTableDefaults.filters);
    const sortField = ref(dataTableDefaults.sortField);
    const sortOrder = ref(dataTableDefaults.sortOrder);
    const currentPage = ref(dataTableDefaults.currentPage);
    const rowsPerPage = ref(dataTableDefaults.rowsPerPage);

    const firstDatasetIndex = computed(() => {
        return (currentPage.value - 1) * rowsPerPage.value;
    });
    const hasFilteringApplied = computed(() => {
        const filters = page.props?.request?.urlParams?.filters || {};
        const sortField = page.props?.request?.urlParams?.sortField || null;
        const isFiltering = Object.values(filters).some(
            (filter) => filter.value !== null && filter.value !== ''
        );
        const isSorting = sortField !== null && sortField !== '';

        return isFiltering || isSorting;
    });

    function fetchData() {
        return new Promise((resolve, reject) => {
            router.reload({
                only: ['request', ...new Set(only)],
                data: {
                    filters: filters.value,
                    sortField: sortField.value,
                    sortOrder: sortOrder.value,
                    page: currentPage.value,
                    rows: rowsPerPage.value,
                },
                preserveState: true,
                onSuccess: (page) => {
                    resolve(page);
                },
                onError: (errors) => {
                    reject(errors);
                },
            });
        });
    }

    function onFilter(event) {
        // TODO: debounce "contains" searches
        currentPage.value = 1;
        filters.value = event.filters;
        // empty arrays cause filtering issues, set to null instead
        Object.keys(filters.value).forEach((key) => {
            const filter = filters.value[key];
            if (Array.isArray(filter.value) && filter.value.length === 0) {
                filters.value[key].value = null;
            }
        });
        fetchData();
    }

    function onSort(event) {
        sortField.value = event.sortField;
        sortOrder.value = event.sortOrder;
        fetchData();
    }

    function onPage(event) {
        currentPage.value = event.page + 1;
        rowsPerPage.value = event.rows;
        fetchData().then(() => {
            scrollToTop();
        });
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    function resetFilters() {
        filters.value = dataTableDefaults.filters;
        sortField.value = dataTableDefaults.sortField;
        sortOrder.value = dataTableDefaults.sortOrder;
        currentPage.value = dataTableDefaults.currentPage;
        rowsPerPage.value = dataTableDefaults.rowsPerPage;
        fetchData();
    }

    function parseUrlParams(urlParams) {
        filters.value = urlParams?.filters || dataTableDefaults.filters;
        // Cast strings to Numbers for v-model
        Object.keys(filters.value).forEach((key) => {
            const filter = filters.value[key];
            if (!filter.value) {
                return;
            }
            if (typeof filter.value === 'string' && !isNaN(filter.value)) {
                filters.value[key].value = Number(filter.value);
            }
            if (Array.isArray(filter.value)) {
                // TODO: find out why there are duplicate array values in multi-select filters
                // "Fixed" with reassigning to unique array
                const unique = [...new Set(filter.value)];
                filter.value = unique;
                filter.value.forEach((value, index) => {
                    if (typeof value === 'string' && !isNaN(value)) {
                        filter.value[index] = Number(value);
                    }
                });
            }
        });
        sortField.value = urlParams?.sortField || dataTableDefaults.sortField;
        sortOrder.value =
            parseInt(urlParams?.sortOrder) || dataTableDefaults.sortOrder;
        currentPage.value =
            parseInt(urlParams?.page) || dataTableDefaults.currentPage;
        rowsPerPage.value =
            parseInt(urlParams?.rows) || dataTableDefaults.rowsPerPage;
    }

    onMounted(() => {
        parseUrlParams(page.props.request.urlParams);
    });

    return {
        filters,
        sortField,
        sortOrder,
        currentPage,
        rowsPerPage,
        firstDatasetIndex,
        hasFilteringApplied,
        onFilter,
        onSort,
        onPage,
        resetFilters,
        fetchData,
        parseUrlParams,
    };
}
