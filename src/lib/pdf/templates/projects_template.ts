export const template = `
<tr>
    <td rowspan="2" class="number-cell">{{index}}</td>
    <td class="industry-cell">
        <p class="border-bottom additional-padding">Type of Industry</p>
        <p class="border-bottom additional-padding">Position</p>
        <p class="additional-padding">Responsibilities</p>
    </td>
    <td class="project-description">
        <div class="project-title">[{{title}}]</div>
        {{description}}
    </td>
    <td class="os-cell">{{os}}</td>
    <td class="lang-cell">{{lang}}</td>
    <td class="db-cell">{{db}}</td>
    <td class="period-cell">
        <p class="border-bottom additional-padding">{{startDate}}</p>
        <p class="border-bottom additional-padding">{{endDate}}</p>
        <p class="additional-padding">{{period}}</p>
    </td>
    <td class="tech-stack">{{techStack}}</td>
</tr>
<tr class="position-row">
    <td colspan="7">
        <strong>Position:</strong> {{position}} | <strong>Responsibilities:</strong> {{responsibilities}}
    </td>
</tr>
`;
