document.addEventListener("DOMContentLoaded", function () {
	//Get all the sections
	let sections = document.querySelectorAll(".section");

	// Initially disable the submit button
	const submitButton = document.getElementById("submitBtn");
	submitButton.disabled = true;

	// Get all the input elements
	const radioInputs = document.querySelectorAll('input[type="radio"]');

	const dayInput = document.getElementById("day");
	const monthInput = document.getElementById("month");
	const yearInput = document.getElementById("year");
	const errorMessage = document.getElementById("date-error-message");

	// Function to update label styles
	function updateLabels() {
		radioInputs.forEach(function (input) {
			// If the input is checked, style its parent label
			if (input.checked) {
				input.parentElement.style.backgroundColor = "var(--lightGreen)";
				input.parentElement.style.borderColor = "var(--green)";
			} else {
				input.parentElement.style.backgroundColor = "var(--gray)";
				input.parentElement.style.borderColor = "transparent";
			}
		});
	}

	radioInputs.forEach(function (input) {
		input.addEventListener("change", function () {
			updateLabels();
			let currentSection = input.closest(".section");
			validateAndHandleCurrentSection(currentSection);
		});
	});

	// Function to enable the next section
	function enableNextSection(currentIndex) {
		if (currentIndex < sections.length - 1) {
			let nextSection = sections[currentIndex + 1];
			nextSection.classList.add("active");
			nextSection.style.opacity = "1";
			nextSection.style.pointerEvents = "auto";

			// Scroll to the next section smoothly
			nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	}

	function deactivateNextSection(currentIndex) {
		if (currentIndex < sections.length - 1) {
			let nextSection = sections[currentIndex + 1];
			nextSection.classList.remove("active");
			nextSection.style.opacity = "0.5";
			nextSection.style.pointerEvents = "none";
		}
	}
	function handleDOBSection() {
		const dobSectionIndex = Array.from(sections).indexOf(
			document.getElementById("section4")
		);
		const dayIsValid = validateDay(dayInput.value);
		const monthIsValid = validateMonth(monthInput.value);
		const yearIsValid = validateYear(yearInput.value);

		if (dayIsValid && monthIsValid && yearIsValid) {
			enableNextSection(dobSectionIndex);
		} else {
			deactivateNextSection(dobSectionIndex);
		}
	}

	dayInput.addEventListener("input", handleDOBSection);
	monthInput.addEventListener("input", handleDOBSection);
	yearInput.addEventListener("input", handleDOBSection);

	// function for integrated section validation

	function validateAndHandleCurrentSection(currentSection) {
		let isSectionValid = true;

		// Validate radio buttons within the section
		const isRadioValid =
			currentSection.querySelector('input[type="radio"]:checked') !== null;
		if (!isRadioValid) {
			isSectionValid = false;
		}

		// Activate the next section if valid
		let currentIndex = Array.from(sections).indexOf(currentSection);
		if (isSectionValid) {
			enableNextSection(currentIndex);
		} else {
			deactivateNextSection(currentIndex);
		}
	}

	// Add event listeners to inputs for section validation

	document.querySelectorAll(".input, input[type='radio']").forEach((input) => {
		input.addEventListener("input", function () {
			let currentSection = input.closest(".section");
			validateAndHandleCurrentSection(currentSection);
		});
	});

	// Initial update in case one is already checked
	updateLabels();

	let progressBar = document.getElementById("progress-bar");

	// Update progress bar function
	function updateProgressBar() {
		let activeSections = document.querySelectorAll(".section.active").length;
		let totalSections = sections.length;
		let width = (activeSections / totalSections) * 100 - 1;
		progressBar.style.width = width + "%";
	}

	// Initialize the progress bar with the first section active
	updateProgressBar();

	// Initially, only the first section should be active
	sections.forEach((section, index) => {
		if (index !== 0) {
			section.classList.remove("active");
		} else {
			section.classList.add("active");
		}
	});

	// Listen for changes in the form
	document
		.getElementById("insurance-form")
		.addEventListener("change", function (e) {
			// If the target of the change event is a radio button
			let currentSection = e.target.closest(".section");
			let allSections = document.querySelectorAll(".section");
			let currentIndex = Array.from(allSections).indexOf(currentSection);
			let nextSection = allSections[currentIndex + 1];

			if (nextSection) {
				nextSection.classList.add("active");
				nextSection.style.opacity = "1";
				nextSection.style.pointerEvents = "auto";
			}
			updateProgressBar();
		});

	// -============================================
	// INPUT VALIDATION HERE
	// =============================================

	// Function to validate general text input

	function validateTextInput(input) {
		return input.value.trim() !== "";
	}

	// Toggle input error function
	function toggleInputError(input, isValid) {
		const errorSpanId = input.id + "-error-message";
		const errorSpan = document.getElementById(errorSpanId);
		if (errorSpan) {
			errorSpan.style.display = isValid ? "none" : "block";
			input.classList.toggle("invalid", !isValid);
		}
	}

	// Get the general input element
	document.querySelectorAll(".input").forEach((input) => {
		input.addEventListener("blur", function () {
			toggleInputError(input, validateTextInput(input));
		});
	});

	//DOB Validation==========================================

	dayInput.addEventListener("input", handleDOBSection);
	monthInput.addEventListener("input", handleDOBSection);
	yearInput.addEventListener("input", handleDOBSection);

	function setInvalid(input, message) {
		input.classList.add("invalid");
		errorMessage.textContent = message;
		errorMessage.style.display = "block"; // Show the error message
	}

	function clearInvalid(input) {
		input.classList.remove("invalid");
		errorMessage.style.display = "none"; // Hide the error message
	}

	function validateDay(day) {
		return day.length === 2 && day > 0 && day <= 31;
	}

	function validateMonth(month) {
		return month.length === 2 && month > 0 && month <= 12;
	}

	function validateYear(year) {
		return year.length === 4 && year > 1900 && year <= new Date().getFullYear();
	}

	// Define the checkFormValidity function here

	function checkFormValidity() {
		let isFormValid = true;
		// Validate .input fields
		document.querySelectorAll(".input").forEach((input) => {
			const isValid = validateTextInput(input);
			if (!isValid) {
				isFormValid = false;
			}
		});

		// Validate radio buttons (adjust the name attribute as per your form)
		const isRadioSelected =
			document.querySelector('input[name="insuranceFor"]:checked') !== null;
		if (!isRadioSelected) {
			isFormValid = false;
		}
		// Validate DOB fields
		const day = document.getElementById("day").value;
		const month = document.getElementById("month").value;
		const year = document.getElementById("year").value;
		if (!validateDay(day) || !validateMonth(month) || !validateYear(year)) {
			isFormValid = false;
		}

		// Enable or disable submit button based on form validity
		if (isFormValid) {
			submitButton.disabled = false;
			submitButton.style.opacity = 1; // Full opacity when enabled
			submitButton.style.cursor = "pointer";
		} else {
			submitButton.disabled = true;
			submitButton.style.opacity = 0.5; // Reduced opacity when disabled
		}
	}

	// Call this function initially and on every input change
	document
		.querySelectorAll(".input, #day, #month, #year, input[type='radio']")
		.forEach((input) => {
			input.addEventListener("input", checkFormValidity);
		});

	// Add event listeners to radio inputs for validation check
	radioInputs.forEach((input) => {
		input.addEventListener("change", checkFormValidity);
	});

	dayInput.addEventListener("input", () => {
		if (dayInput.value.length === 2) {
			if (validateDay(dayInput.value)) {
				clearInvalid(dayInput);
				monthInput.focus();
			} else {
				setInvalid(dayInput, "Please enter a valid day.");
			}
		}
	});

	monthInput.addEventListener("input", () => {
		if (monthInput.value.length === 2) {
			if (validateMonth(monthInput.value)) {
				clearInvalid(monthInput);
				yearInput.focus();
			} else {
				setInvalid(monthInput, "Please enter a valid month.");
			}
		}
	});

	yearInput.addEventListener("input", () => {
		if (yearInput.value.length === 4) {
			if (!validateYear(yearInput.value)) {
				setInvalid(yearInput, "Please enter a valid year.");
			} else {
				clearInvalid(yearInput);
			}
		}
	});

	// =======================================================
	//		Handle form submission
	//=======================================================
	document
		.getElementById("insurance-form")
		.addEventListener("submit", function (e) {
			e.preventDefault(); // Prevent the default form submission

			// Collect form data
			let formData = new FormData(e.target);
			let data = {};
			let isFormValid = true;
			let firstInvalidInput = null;

			// Get the value of the full name input
			const fullName = document.getElementById("fullname").value;

			// Validate all .input fields
			document.querySelectorAll(".input").forEach((input) => {
				const isValid = validateTextInput(input);
				toggleInputError(input, isValid);
				if (!isValid && !firstInvalidInput) {
					firstInvalidInput = input;
					isFormValid = false;
				}
			});

			// Collecting the form data for DOB
			const day = document.getElementById("day");
			const month = document.getElementById("month");
			const year = document.getElementById("year");
			const dob = `${day.value}/${month.value}/${year.value}`;

			// Validation for day, month, and year
			const isValidDay = validateDay(day.value);
			const isValidMonth = validateMonth(month.value);
			const isValidYear = validateYear(year.value);

			if (!isValidDay || !isValidMonth || !isValidYear) {
				let dobErrorMessage = "Please enter a valid date.";
				errorMessage.textContent = dobErrorMessage;
				errorMessage.style.display = "block";

				if (!firstInvalidInput)
					firstInvalidInput = !isValidDay ? day : !isValidMonth ? month : year;
				isFormValid = false;
			} else {
				errorMessage.textContent = "";
				errorMessage.style.display = "none";
			}

			if (!isFormValid) {
				if (
					firstInvalidInput &&
					typeof firstInvalidInput.scrollIntoView === "function"
				) {
					firstInvalidInput.scrollIntoView({
						behavior: "smooth",
						block: "center",
					});
				}
				return; // Stop form submission if any input is invalid
			}

			// Proceed with collecting form data
			formData.forEach((value, key) => {
				data[key] = value;
			});
			// Display the collected data in the console
			console.log("Form data to be sent:", data);

			// Update the progress bar to show completion
			progressBar.style.width = "100%";

			// Reset the form and sections
			e.target.reset(); // This will reset all inputs in the form

			// Clear individual input fields if needed
			document.getElementById("day").value = "";
			document.getElementById("month").value = "";
			document.getElementById("year").value = "";

			// Clear error message
			errorMessage.textContent = "";
			errorMessage.style.display = "none";

			// Reset the labels and sections to their default styles
			radioInputs.forEach((input) => {
				input.checked = false; // Uncheck all radio buttons
				input.parentElement.style.backgroundColor = "var(--gray)";
				input.parentElement.style.borderColor = "transparent";
			});

			// Deactivate all sections except the first
			sections.forEach((section, index) => {
				section.classList.remove("active");
				section.style.opacity = index === 0 ? "1" : "0.5";
				section.style.pointerEvents = index === 0 ? "auto" : "none";
				if (index === 0) {
					section.classList.add("active"); // Only the first section should be active
				}
			});

			console.log("Form Data:", formData);
			// Send data to the backend here

			// Store the full name in Local Storage
			localStorage.setItem("fullName", fullName);

			// Redirect to the thank you page after processing the form data
			window.location.href = "/thankyou.html";
		});
});
