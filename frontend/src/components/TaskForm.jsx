import React, { useState } from "react";


const [taskData, setTaskData] = useState({
  title: "",
  description: "",
  status: "TODO",      // Correspond à STATUS_CHOICES
  priority: "MEDIUM",  // Correspond à PRIORITY_CHOICES
  due_date: "",
  project: selectedProjectId
});

// Dans le rendu du formulaire :
<select name="status" onChange={handleTaskChange}>
  <option value="TODO">À faire</option>
  <option value="IN_PROGRESS">En cours</option>
  <option value="DONE">Terminé</option>
</select>

<select name="priority" onChange={handleTaskChange}>
  <option value="LOW">Faible</option>
  <option value="MEDIUM">Moyenne</option>
  <option value="HIGH">Élevée</option>
</select>