document.getElementById("name").textContent = data.name;
    document.getElementById("title").textContent = data.title;
    document.getElementById("description").textContent = data.description;

    const contentDiv = document.getElementById("content");

    data.sections.forEach(section => {
      const sectionEl = document.createElement("div");

      const heading = document.createElement("h3");
      heading.textContent = section.heading;

      const text = document.createElement("p");
      text.textContent = section.text;

      sectionEl.appendChild(heading);
      sectionEl.appendChild(text);

      contentDiv.appendChild(sectionEl);
    });
  });