import {
  appliedFiltersIndexes,
  filterFields,
  tableColumns,
} from "./constants.js";

const filterInputs = document.querySelectorAll(".filter-input");
const filtersText = document.querySelector(".sidebar-toggle");
const filtersText2 = document.querySelector(".text-filter");
let tableDataCopy = [];
let filterOptions = [];

filterInputs.forEach((input, index) => {
  input.addEventListener("focus", () => {
    input.nextElementSibling.nextElementSibling.classList.remove("hidden");
    filterInputs.forEach((inp, ind) => {
      if (ind !== index)
        inp.nextElementSibling.nextElementSibling.classList.add("hidden");
    });
  });
});

const fetchTableData = async () => {
  const response = await fetch("./data.json");
  const data = await response.json();
  generateTableHead();
  displayTableData(data.items);
  tableDataCopy = data.items;
};

fetchTableData();

function selectFruit(fruit, index) {
  const p = document.createElement("p");
  p.style.backgroundColor = "#D0E8ECFF";
  p.style.padding = "4px 8px";
  p.style.borderRadius = "5px";
  p.textContent = fruit;
  filterInputs[index].previousElementSibling.appendChild(p);

  !appliedFiltersIndexes.includes(index) && appliedFiltersIndexes.push(index);
  filtersText.textContent = `Фильтры (${appliedFiltersIndexes.length})`;
  filtersText2.textContent = `Фильтры (${appliedFiltersIndexes.length})`;

  filterInputs[index].nextElementSibling.nextElementSibling.style.display =
    "none";
}

function checkAllCheckboxes() {
  const checkAllCheckboxes = document.querySelectorAll("input[type=checkbox]");
  checkAllCheckboxes.forEach((checkbox) => {
    checkbox.checked = document.getElementById("selectAll").checked;
  });
}

function generateTableHead() {
  const thead = document.querySelector("thead");
  thead.innerHTML += `
  
  <tr style="background-color: white;">
  ${tableColumns
    .map((item, index) => {
      if (index === 0) {
        return `<th style="padding: 0 20px;"><input style="width: 16px; height: 16px;" type="checkbox" id="selectAll" /></th>`;
      }
      return `<th style="font-size: 14px;">${item}</th>`;
    })
    .join("")}
    </tr>
    <tr style="background-color: white; transform: translateY(-1px);">
      <th></th>
      <th></th>
      <th style="border-left: 1px solid #E2E8EAFF;">
        <input name="number" style="outline: none; width: 80%" type="search" >
        <i class="fa-solid mr-2 fa-magnifying-glass"></i>
      </th>
      <th style="border-left: 1px solid #E2E8EAFF;">
        <input name="declDate" style="width: 80%; outline: none;" type="search" >
        <i class="fa-solid mr-2 fa-magnifying-glass"></i>
      </th>
      <th style="border-left: 1px solid #E2E8EAFF;">
        <input name="declEndDate" style="width: 80%; outline: none;" type="search" >
        <i class="fa-solid mr-2 fa-magnifying-glass"></i>
      </th>
      <th style="border-left: 1px solid #E2E8EAFF;">
        <input  name="applicantName" style="width: 80%; outline: none;" type="search" >
        <i class="fa-solid mr-2 fa-magnifying-glass"></i>
      </th>
      <th style="border-left: 1px solid #E2E8EAFF;">
        <input name="manufacterName" style="width: 80%; outline: none;" type="search" >
        <i  class="fa-solid mr-2 fa-magnifying-glass"></i>
      </th>
      <th style="border-left: 1px solid #E2E8EAFF;">
        <input name="productFullName" style="width: 80%; outline: none;" type="search" >
        <i class="fa-solid mr-2 fa-magnifying-glass"></i>
      </th>
      <th style="border-left: 1px solid #E2E8EAFF;">
        <input name="statusTestingLabs" style="width: 80%; outline: none;" type="search" >
        <i class="fa-solid mr-2 fa-magnifying-glass"></i>
      </th>
    </tr>
  `;
}

function displayTableData(tableData) {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = `
  
    
        ${tableData
          .map((item) => {
            return `
              <tr style="background-color: white;">
              <td style="padding: 0 20px;"><input style="width: 16px; height: 16px;" type="checkbox" /></td>
              <td style="font-size: 14px;">${statusChecker(item.idStatus)}</td>
              <td style="font-size: 14px;">${item.number}</td>
              <td  style="font-size: 14px;">${item.declDate}</td>
              <td  style="font-size: 14px;">${item.declEndDate}</td>
              <td style="font-size: 14px; width: 10%;">${
                item.applicantName
              }</td>
              <td  style="font-size: 14px; width: 10%;">${
                item.manufacterName
              }</td>
              <td  style="font-size: 14px;">${item.productFullName}</td>
              <td  style="font-size: 14px;">${item.statusTestingLabs}</td>
              </tr>
              `;
          })
          .join("")}
    `;

  document
    .getElementById("selectAll")
    .addEventListener("change", checkAllCheckboxes);

  const searchFilters = document.querySelectorAll("th > input[type='search']");
  searchFilters.forEach((searchEl) => {
    searchEl.addEventListener("input", (e) => {
      searchFilter(e.target.value, e.target.name);
    });
  });
}

function statusChecker(status) {
  if (status === 14)
    return `<i style="font-size: 26px;" class="fa-solid fa-file-zipper"></i>`;
  if (status === 6)
    return `<i style="font-size: 26px; color: #03B090FF;" class="fa-regular fa-circle-check"></i>`;
}

function searchFilter(searchTerm, fieldName) {
  const searchedData = tableDataCopy.filter((d) =>
    d[fieldName].toLowerCase().includes(searchTerm.toLowerCase())
  );

  displayTableData(searchedData);
}

function displayFilterOptions(data, input) {
  const dropdowns = document.querySelectorAll(".filter-input");
  dropdowns.forEach((dropdown, index) => {
    dropdown.nextElementSibling.nextElementSibling.innerHTML += data[
      index
    ]?.items
      .map((item) => {
        if (!item.name) return "";
        return `<li style="font-size: 14px; font-weight: 300; cursor: pointer;padding: 4px 8px; list-style: none;">${item.name}</li>`;
      })
      .join("");
    const dropdownOptions = document.querySelectorAll("li");
    dropdownOptions.forEach((option) => {
      option.addEventListener("click", () => {
        selectFruit(option.textContent, index);
      });
    });
  });
}

function filterOptionsSearch(searchTerm) {
  const searchedData = filterOptions.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  displayFilterOptions(searchedData);
}

const fetchAllJSONFiles = async () => {
  try {
    // Use Promise.all to fetch all files concurrently
    const responses = await Promise.all(
      Object.values(filterFields).map((file) => fetch(file))
    );

    // Parse all responses as JSON
    const data = await Promise.all(
      responses.map((response) => response.json())
    );

    console.log("All JSON data:", data);
    // const dropdowns = document.querySelectorAll(".filter-input")
    displayFilterOptions(data);
    return data;
  } catch (error) {
    console.error("Error fetching JSON files:", error);
  }
};

fetchAllJSONFiles();
