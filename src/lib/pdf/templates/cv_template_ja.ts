export const cvTemplate = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>技術経歴書</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;300;400;500;700;900&display=swap" rel="stylesheet">
    <style>
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: "Noto Sans JP", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", sans-serif;
            margin: 0;
            padding: 20px;
            line-height: 1.4;
            background-color: #f5f5f5 !important;
        }
        
        .resume-container {
            max-width: 800px;
            margin: 0 auto;
            box-sizing: border-box;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            padding: 30px;
        }
        
        .title {
            text-align: center;
            font-size: 24pt;
            font-weight: bold;
            border: 1px solid #000;
            letter-spacing: 0.2em;
            border-bottom: none;
        }
        
        .profile-section {
            display: grid;
            grid-template-columns: 1fr 250px;
        }
        
        .profile-info {
            display: flex;
            flex-direction: column;
        }
        
        .profile-row {
            flex: 1;
            display: flex;
            flex-direction: row;
            border: 1px solid #000;
            min-height: 52px;

            .left-border {
                border-left: 1px solid #000;
            };

            .right-border {
                border-right: 1px solid #000;
            }
        }
        
        .profile-row:not(:first-child) {
            border-top: none;
        }

        .no-border-top {
            border-top: none !important;
        }
        
        .profile-label {
            background-color: #ccffff !important;
            box-sizing: border-box;
            font-weight: bold;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 7pt;
            width: 100px;
            min-width: 100px;
            height: 100%;
        }

        .profile-label-small {
            background-color: #ccffff !important;
            box-sizing: border-box;
            font-weight: bold;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 7pt;
            width: 50px;
            min-width: 50px;
            height: 100%;
        }
        
        .profile-value {
            flex: 1;
            padding: 12px;
            display: flex;
            flex-direction: column;
            align-items: start;
            font-size: 7pt;
            justify-content: center;
            text-align: center;
            white-space: pre-line;
        }

        .profile-value-small {
            flex: 0.3;
            padding: 12px 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 7pt;
            text-align: start;
            white-space: pre-line;
        }

        .font-small-value {
            font-size: 7pt;
        }

        .profile-photo {
            border: 1px solid #000;
            max-width: 100%;
            border-left: none;
            text-align: center;
            background-color: #ccffff !important;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .profile-photo img {
            object-fit: cover;
            height: 100%;
            max-width: 80%;
            flex: 1;
            min-height: 100%;
        }
        
        .skills-section {
        }
        
        .skills-row {
            display: grid;
            grid-template-columns: 100px 1fr;
            border: 1px solid #000;
            min-height: 40px;
        }
        
        .skills-row:not(:first-child) {
            border-top: none;
        }
        
        .skills-label {
            background-color: #ccffff !important;
            padding: 12px 8px;
            font-weight: bold;
            text-align: center;
            border-right: 1px solid #000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 7pt;
            width: 100px;
            min-width: 100px;
        }
        
        .skills-content {
            padding: 12px;
            line-height: 1.6;
            font-size: 7pt;
        }
        
        .experience-section {
        }
        
        .experience-header {
            background-color: #f0f0f0 !important;
            padding: 12px;
            font-size: 7pt;
            border: 1px solid #000;
            text-align: left;
        }
        
        .experience-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 7pt;
        }
        
        .experience-table th,
        .experience-table td {
            border: 1px solid #000;
            padding: 8px 0px;
            text-align: center;
            vertical-align: middle;
            /* Prevent page breaks within table cells */
            page-break-inside: avoid;
            break-inside: avoid;

            .border-bottom {
                border-bottom: 1px solid #000 !important;
            }

            .additional-padding {
                padding: 15px 0px;
            }
        }
        
        .experience-table th {
            background-color: #ccffff !important;
            font-weight: bold;
            font-size: 7pt;
        }
        
        /* Ensure table rows don't break across pages */
        .experience-table tr {
            page-break-inside: avoid;
            break-inside: avoid;
            page-break-after: auto;
            break-after: auto;
            /* Additional properties for better page break control */
            orphans: 1;
            widows: 1;
        }
        
        /* Prevent page breaks within the entire table */
        .experience-table {
            page-break-inside: auto;
            break-inside: auto;
        }
        
        /* Ensure project rows stay together */
        .project-row {
            page-break-inside: avoid;
            break-inside: avoid;
        }
        
        .project-description {
            text-align: left;
            font-size: 7pt;
            line-height: 1.4;
            padding: 12px;
            max-width: 300px;
            white-space: pre-line;
            color: black;
        }
        
        .project-title {
            font-weight: bold;
            margin-bottom: 8px;
            color: #333;
            text-align: start;
            padding-left: 10px;
        }
        
        .tech-stack {
            font-size: 7pt;
            line-height: 1.3;
            text-align: left;
            padding: 8px;
        }
        
        .period-cell {
            font-size: 7pt;
            font-weight: bold;
            white-space: nowrap;
        }
        
        .position-row {
            background-color: #f9f9f9 !important;
            font-size: 7pt;
        }
        
        .number-cell {
            font-weight: bold;
            background-color: #fff !important;
            font-size: 7pt;
            vertical-align: middle;
        }
        
        .industry-cell {
            font-size: 7pt;
            background-color: #fff !important;
            vertical-align: middle;
        }
        
        .os-cell, .lang-cell, .db-cell {
            font-size: 7pt;
            line-height: 1.2;
            max-width: 80px;
            vertical-align: middle;
        }

        .full-padding {
            padding-top: 50% !important;
            padding-bottom: 50% !important;
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .resume-container {
                box-shadow: none;
                padding: 20px;
            }
            
            /* Enhanced page break control for printing */
            .experience-table tr {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
                orphans: 1;
                widows: 1;
            }
            
            .experience-table td,
            .experience-table th {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }
            
            /* Allow page breaks between rows but not within them */
            .experience-table {
                page-break-inside: auto;
                break-inside: auto;
            }
        }
    </style>
</head>
<body>
    <div class="resume-container">
        <div class="title">技術経歴書</div>
        
        <div class="profile-section">
            <div class="profile-info">
                <div class="profile-row">
                    <div class="profile-label right-border">エンジニア名</div>
                    <div class="profile-value font-small-value right-border" contenteditable="true">{{applicantName}}</div>
                    <div class="profile-value-small" contenteditable="true">{{birthDate}}歳</div>
                    <div class="profile-label-small left-border right-border">在住</div>
                    <div class="profile-value" contenteditable="true">{{country}}</div>
                </div>
                <div class="profile-row">
                    <div class="profile-label right-border">最終学歴</div>
                    <div class="profile-value" contenteditable="true">{{education}}</div>
                </div>
                <div class="profile-row">
                    <div class="profile-label right-border">経験年数</div>
                    <div class="profile-value" contenteditable="true">{{yearsOfExperience}}年</div>
                    <div class="profile-label left-border right-border">就業可能日</div>
                    <div class="profile-value" contenteditable="true">{{whenReadyToWork}}</div>
                </div>
                <div class="profile-row">
                    <div class="profile-label right-border">資格等</div>
                    <div class="profile-value" contenteditable="true">
                        {{certificates}}
                    </div>
                </div>
            </div>
            <div class="profile-photo">
                <img src="{{photo}}" alt="Profile Photo">
            </div>
        </div>

        <div class="skills-section">
            <div class="skills-row no-border-top">
                <div class="skills-label">スキル</div>
                <div class="skills-content">
                    <strong>開発言語: </strong><span contenteditable="true">{{languages}}</span><br>
                    <strong>フレームワーク・ライブラリ: </strong><span contenteditable="true">{{frameworks}}</span><br>
                    <strong>データベース: </strong><span contenteditable="true">{{databases}}</span><br>
                    <strong>DevOps: </strong><span contenteditable="true">{{devOps}}</span><br>
                    <strong>その他: </strong><span contenteditable="true">{{other}}</span>
                </div>
            </div>
            <div class="skills-row">
                <div class="skills-label">備考</div>
                <div class="skills-content" contenteditable="true">
                    {{additionalInfo}}
                </div>
            </div>
        </div>

        <div class="experience-section">
            <div class="experience-header">
               （注：担当フェーズ １：要件定義、２：基本（論理）設計、３：詳細（物理）設計、４：製造、単体テスト、５：結合テスト、総合テスト,６：保守、７：運用、８：その他）
            </div>
            <table class="experience-table">
                <thead>
                    <tr>
                        <th style="width: 40px; padding: 0; vertical-align: middle;">No</th>
                        <th style="width: 100px; padding: 0; vertical-align: middle;">
                            <p class="border-bottom">業種</p>
                            <p class="border-bottom">ポジション</p>
                            <p>担当フェーズ</p>
                        </th>
                        <th style="width: 350px; padding: 0; vertical-align: middle;">作業内容</th>
                        <th style="width: 100px; padding: 0; vertical-align: middle;">OS</th>
                        <th style="width: 100px; padding: 0; vertical-align: middle;">言語</th>
                        <th style="width: 80px; padding: 0; vertical-align: middle;">DB</th>
                        <th style="width: 100px; padding: 0; vertical-align: middle;">
                            <p class="border-bottom">開始年月</p>
                            <p class="border-bottom">終了年月</p>
                            <p>就業期間</p>
                        </th>
                        <th style="width: 120px; padding: 0; vertical-align: middle;">備考</th>
                    </tr>
                </thead>
                <tbody>
                    {{projects}}
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>`;
