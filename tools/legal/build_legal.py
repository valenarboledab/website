#!/usr/bin/env python3
"""Rewrites the Terms, Privacy and Cookie pages inside index.html and es/index.html.

Each page lives in a <div id="page-terms|page-privacy|page-cookies" class="page"> block.
This script replaces the inner .sp-wrap of each block, in both languages, so the legal
text can be edited in one place and rebuilt. Run from the repo root:

    python3 tools/legal/build_legal.py
"""
import re
import sys

UPDATED_EN = "November 3, 2026"
UPDATED_ES = "3 de noviembre de 2026"
EMAIL = "officestudiovalentina@gmail.com"


def wrap(eyebrow, title_html, lead, body):
    return (
        '\n<div class="sp-wrap">\n'
        f'<p class="sp-ey">{eyebrow}</p>\n'
        f'<h2 class="sp-title">{title_html}</h2>\n'
        f'<p class="sp-lead">{lead}</p>\n'
        f'{body}\n'
        '</div>\n'
    )


# ───────────────────────────── TERMS (EN) ─────────────────────────────
TERMS_EN_BODY = f"""
<h2>1. Who we are and what these terms cover</h2>
<p>studio-valentina.com (the "Site") is operated by Valentina Arboleda, doing business as Studio Valentina, in the State of Georgia, United States ("Studio Valentina," "we," "us," "our"). These Terms &amp; Conditions ("Terms") are a legal agreement between you and Studio Valentina and govern your access to and use of the Site, the free resources offered on it, the Client Portal and any communication you start through the Site, including WhatsApp and email.</p>
<p>By using the Site you confirm that you have read and accept these Terms, together with our <a onclick="showPage('privacy')">Privacy Policy</a> and <a onclick="showPage('cookies')">Cookie Policy</a>, which are incorporated here by reference. If you do not accept them, please do not use the Site.</p>

<h2>2. Eligibility</h2>
<p>The Site is intended for people aged 18 or over, or for minors acting with the consent and supervision of a parent or legal guardian. The Site is not directed to children under 13. By using the Site you confirm that you meet this requirement and that any information you provide is accurate and your own, or that you are authorized to provide it.</p>

<h2>3. The Site is information, not an offer</h2>
<p>Everything published on the Site — project pages, renders, drawings, articles, guides, templates, prices or ranges, timelines and descriptions of services — is published for general information and to show previous work. It is <strong>not</strong> an offer capable of acceptance, a quotation, a bid, a contract, or advice for your particular project, lot, budget or jurisdiction.</p>
<p>Studio Valentina provides services only under a separate written agreement signed by both parties, which defines the scope, deliverables, fees, schedule, responsibilities and limits of that engagement. Nothing on the Site modifies a signed agreement, and in case of any conflict the signed agreement prevails.</p>

<h2>4. Professional status and licensure</h2>
<p>Valentina Arboleda is an architect licensed in Colombia, a Construction Project Management specialist and a candidate on the NCARB International Architect Path toward licensure in the United States. She is <strong>not</strong> a licensed architect in any U.S. state.</p>
<p>In the United States, Studio Valentina offers architectural design, interior design, space planning, BIM coordination, visualization and project support services that do not require a state architectural license. Where a project requires drawings or documents sealed by a licensed professional, those documents are prepared, reviewed and sealed by a licensed architect or engineer of record retained for that project, and Studio Valentina works in support of that professional.</p>
<p>Nothing on the Site should be read as a representation that Studio Valentina practices architecture, or uses the title "architect," in any jurisdiction where it is not authorized to do so.</p>

<h2>5. No professional, legal, financial or code advice</h2>
<p>Articles, guides, checklists, budget tools, prompts and similar materials on the Site are educational. They are general in nature, they are not tailored to your circumstances, and building codes, zoning rules, permit requirements, costs and availability vary by state, county and city and change over time.</p>
<p>They do not constitute architectural, engineering, construction, legal, tax, insurance or financial advice, and you should not rely on them as a substitute for the opinion of a qualified professional or of the authority having jurisdiction. Any figure, cost range, duration or code reference is an illustration, not a commitment, and must be verified before you act on it.</p>

<h2>6. Intellectual property</h2>
<p>All content on the Site — including designs, floor plans, elevations, 3D models, renders, photographs, video, text, articles, templates, graphics, the Studio Valentina name and logo, and the Nala illustrations — is owned by Valentina Arboleda or used with permission, and is protected by copyright, trademark and other intellectual property laws of the United States and other countries.</p>
<p>You are granted a limited, personal, non-exclusive, non-transferable and revocable license to view the Site and to use the free resources as described in section 7. You may not, without our prior written consent:</p>
<ul>
<li>copy, reproduce, republish, distribute, sell, license or exploit any content commercially;</li>
<li>use any design, render or drawing as the basis for construction, for a competing portfolio, or in a proposal to a third party;</li>
<li>use our content to train, fine-tune or evaluate machine-learning models, or scrape the Site by automated means;</li>
<li>remove, obscure or alter any credit, watermark or copyright notice;</li>
<li>use the Studio Valentina name, logo or mascot in a way that suggests endorsement or association.</li>
</ul>
<p>Names, logos and trademarks of third parties shown on the Site belong to their respective owners and are used for identification only. If you believe content on the Site infringes your rights, write to <a href="mailto:{EMAIL}">{EMAIL}</a> identifying the material and your claim, and we will review it promptly.</p>

<h2>7. Free resources and templates</h2>
<p>Studio Valentina offers downloadable resources such as guides, checklists, spreadsheets, moodboard templates and illustrations ("Resources"), normally in exchange for your name and email address.</p>
<p>Subject to these Terms, you receive a perpetual, worldwide, non-exclusive license to use the Resources <strong>for your own personal or internal business purposes</strong>, including on your own projects and with your own clients. You may adapt a template to your project and share the resulting work with your client.</p>
<p>You may not resell, redistribute, sublicense, publish or share the Resource files themselves, in whole or in part; offer them for download; include them in a product, bundle, course or template library; present them as your own work; or remove the Studio Valentina identity from them. The Resources are provided "as is," without warranty, and are not a substitute for professional advice.</p>

<h2>8. What you send us</h2>
<p>When you contact us through the Site, WhatsApp, email or the Client Portal, you are responsible for the accuracy and legality of what you send, and you confirm you have the right to share it. Please do not send confidential, sensitive or proprietary material before a written agreement or confidentiality agreement is in place; information sent before then is not treated as confidential, although it is handled according to our <a onclick="showPage('privacy')">Privacy Policy</a>.</p>
<p>If you send suggestions, ideas or feedback about the Site or our services, you grant us a free, perpetual and irrevocable right to use them without obligation or compensation.</p>

<h2>9. Client Portal</h2>
<p>The Client Portal is reserved for clients who have been invited by Studio Valentina. You are responsible for keeping your credentials confidential, for everything done through your account, and for telling us immediately at <a href="mailto:{EMAIL}">{EMAIL}</a> if you suspect unauthorized access.</p>
<p>Information shown in the Portal — phases, status, next steps, updates and documents — is a convenience summary maintained manually. It may be incomplete or out of date, and it does not replace your signed agreement, the official project documents, the permit set or any communication from your contractor or the authority having jurisdiction. Where the Portal and your written agreement differ, the agreement controls.</p>
<p>We may suspend, change or close Portal access, including on completion of a project, or if an account is misused.</p>

<h2>10. Communications</h2>
<p>When you write to us by email, through the contact form or on WhatsApp, you agree that we may reply through the same channel. If you check the box to receive occasional design tips and new resources, you may unsubscribe at any time using the link in any such message or by writing to <a href="mailto:{EMAIL}">{EMAIL}</a>. Messages related to a project, a quotation or a download you requested are transactional and are sent regardless of marketing preferences. Standard message and data rates from your carrier or messaging provider may apply.</p>

<h2>11. Third-party sites and services</h2>
<p>The Site links to and relies on third-party services, including LinkedIn, WhatsApp (Meta), Google (Fonts, Analytics and Firebase) and GitHub Pages. We do not control those services, we are not responsible for their content, availability or practices, and your use of them is governed by their own terms and privacy policies.</p>

<h2>12. Availability and changes to the Site</h2>
<p>We aim to keep the Site available but do not guarantee uninterrupted or error-free access. We may change, suspend, restrict or discontinue the Site, any Resource or the Client Portal at any time, with or without notice, and we may correct content at any time without obligation to preserve earlier versions.</p>

<h2>13. Disclaimers</h2>
<p>The Site, its content, the Resources and the Client Portal are provided "as is" and "as available," without warranties of any kind, whether express, implied or statutory, including any implied warranties of merchantability, fitness for a particular purpose, title, accuracy and non-infringement. We do not warrant that the Site will be secure, uninterrupted, free of errors or free of harmful components, or that any content, figure, timeline or code reference is current, complete or applicable to your project.</p>
<p>Images shown on the Site, including renders and visualizations, are illustrative. They may show finishes, furniture, landscaping, lighting or surroundings that are not part of a built result, and they do not represent a guarantee of outcome.</p>

<h2>14. Limitation of liability</h2>
<p>To the fullest extent permitted by law, Studio Valentina and Valentina Arboleda will not be liable for any indirect, incidental, special, consequential, exemplary or punitive damages, or for loss of profits, revenue, data, business, goodwill or anticipated savings, arising out of or related to your use of or inability to use the Site, the Resources or the Client Portal, even if advised of the possibility of such damages.</p>
<p>To the fullest extent permitted by law, our total aggregate liability for all claims relating to the Site, the Resources or the Client Portal will not exceed one hundred U.S. dollars (US$100), or the amount you paid us for access to the item giving rise to the claim, whichever is greater. This limitation does not apply to liability arising from a signed services agreement, which is governed by that agreement, nor to any liability that cannot be limited or excluded under applicable law.</p>
<p>Some jurisdictions do not allow certain exclusions or limitations, so parts of this section may not apply to you.</p>

<h2>15. Indemnification</h2>
<p>You agree to indemnify and hold harmless Studio Valentina and Valentina Arboleda from any claim, loss, liability, cost or expense, including reasonable legal fees, arising from your misuse of the Site or the Resources, your breach of these Terms, or your violation of any law or third-party right.</p>

<h2>16. Suspension and termination</h2>
<p>We may restrict or end your access to the Site, a Resource or the Client Portal at any time if we reasonably believe you have breached these Terms or that your use harms the Site, our clients or a third party. Sections that by their nature should survive termination — including intellectual property, disclaimers, limitation of liability, indemnification and governing law — will survive.</p>

<h2>17. Governing law and disputes</h2>
<p>These Terms are governed by the laws of the State of Georgia, United States, without regard to conflict-of-law principles. Before starting any formal proceeding, you agree to contact us at <a href="mailto:{EMAIL}">{EMAIL}</a> and to try in good faith to resolve the matter informally for at least thirty (30) days.</p>
<p>If the matter is not resolved, you and Studio Valentina agree that the state and federal courts located in the State of Georgia will have exclusive jurisdiction, and you consent to venue there. If you access the Site from outside the United States, you do so on your own initiative and are responsible for complying with your local law.</p>

<h2>18. General</h2>
<p>If any provision of these Terms is held unenforceable, the rest remains in force and the unenforceable provision will be applied to the maximum extent permitted. Our failure to enforce a provision is not a waiver of it. You may not assign these Terms; we may assign them in connection with a reorganization or transfer of the business. These Terms, together with the Privacy Policy, the Cookie Policy and any signed agreement, are the entire agreement between us regarding the Site. The English version of these Terms prevails over any translation.</p>

<h2>19. Changes to these Terms</h2>
<p>We may update these Terms. The "last updated" date above shows the current version, and your continued use of the Site after a change means you accept the updated Terms. For material changes we will make the update visible on this page.</p>

<h2>20. Contact</h2>
<p>Studio Valentina — Valentina Arboleda<br>
Peachtree City, Georgia, United States<br>
Email: <a href="mailto:{EMAIL}">{EMAIL}</a><br>
WhatsApp: +1 (678) 490-5574</p>
"""

# ───────────────────────────── TERMS (ES) ─────────────────────────────
TERMS_ES_BODY = f"""
<h2>1. Quiénes somos y qué cubren estas condiciones</h2>
<p>studio-valentina.com (el "Sitio") es operado por Valentina Arboleda, que opera comercialmente como Studio Valentina, en el Estado de Georgia, Estados Unidos ("Studio Valentina", "nosotros"). Estos Términos y Condiciones (los "Términos") son un acuerdo legal entre usted y Studio Valentina y regulan su acceso y uso del Sitio, de los recursos gratuitos que se ofrecen en él, del Portal de Clientes y de cualquier comunicación que inicie a través del Sitio, incluidas WhatsApp y el correo electrónico.</p>
<p>Al usar el Sitio usted confirma que ha leído y acepta estos Términos, junto con nuestra <a onclick="showPage('privacy')">Política de Privacidad</a> y nuestra <a onclick="showPage('cookies')">Política de Cookies</a>, que forman parte de este documento. Si no los acepta, por favor no use el Sitio.</p>

<h2>2. Quién puede usar el Sitio</h2>
<p>El Sitio está dirigido a personas mayores de 18 años, o a menores que actúen con el consentimiento y la supervisión de su padre, madre o tutor legal. El Sitio no está dirigido a menores de 13 años. Al usarlo, usted confirma que cumple este requisito y que la información que entrega es veraz y propia, o que está autorizado para entregarla.</p>

<h2>3. El Sitio es información, no una oferta</h2>
<p>Todo lo publicado en el Sitio — páginas de proyectos, renders, planos, artículos, guías, plantillas, precios o rangos, plazos y descripciones de servicios — se publica con fines informativos y para mostrar trabajo previo. <strong>No</strong> es una oferta susceptible de aceptación, ni una cotización, ni una propuesta, ni un contrato, ni asesoría para su proyecto, lote, presupuesto o jurisdicción en particular.</p>
<p>Studio Valentina presta servicios únicamente mediante un acuerdo escrito firmado por ambas partes, que define el alcance, los entregables, los honorarios, el cronograma, las responsabilidades y los límites de ese encargo. Nada en el Sitio modifica un acuerdo firmado y, en caso de conflicto, prevalece el acuerdo firmado.</p>

<h2>4. Situación profesional y licencia</h2>
<p>Valentina Arboleda es arquitecta con licencia en Colombia, especialista en Gerencia de Proyectos de Construcción y candidata del NCARB International Architect Path para obtener la licencia en Estados Unidos. <strong>No</strong> es arquitecta con licencia en ningún estado de EE.UU.</p>
<p>En Estados Unidos, Studio Valentina ofrece servicios de diseño arquitectónico, diseño interior, planificación de espacios, coordinación BIM, visualización y apoyo a proyectos que no requieren licencia estatal de arquitectura. Cuando un proyecto exige planos o documentos sellados por un profesional con licencia, esos documentos los prepara, revisa y sella el arquitecto o ingeniero responsable con licencia contratado para ese proyecto, y Studio Valentina trabaja en apoyo de ese profesional.</p>
<p>Nada en el Sitio debe entenderse como una declaración de que Studio Valentina ejerce la arquitectura, o usa el título de "arquitecto", en una jurisdicción donde no está autorizada a hacerlo.</p>

<h2>5. No es asesoría profesional, legal, financiera ni normativa</h2>
<p>Los artículos, guías, listas de chequeo, herramientas de presupuesto, prompts y materiales similares del Sitio son educativos. Son de carácter general, no están adaptados a su caso, y los códigos de construcción, las normas de zonificación, los requisitos de permisos, los costos y la disponibilidad varían según el estado, el condado y la ciudad, y cambian con el tiempo.</p>
<p>No constituyen asesoría arquitectónica, de ingeniería, de construcción, legal, tributaria, de seguros ni financiera, y no deben reemplazar la opinión de un profesional calificado ni de la autoridad competente. Cualquier cifra, rango de costos, plazo o referencia normativa es un ejemplo, no un compromiso, y debe verificarse antes de actuar con base en él.</p>

<h2>6. Propiedad intelectual</h2>
<p>Todo el contenido del Sitio — diseños, plantas, alzados, modelos 3D, renders, fotografías, video, textos, artículos, plantillas, gráficos, el nombre y el logo de Studio Valentina y las ilustraciones de Nala — pertenece a Valentina Arboleda o se usa con autorización, y está protegido por las leyes de derechos de autor, marcas y demás normas de propiedad intelectual de Estados Unidos y de otros países.</p>
<p>Se le concede una licencia limitada, personal, no exclusiva, intransferible y revocable para ver el Sitio y usar los recursos gratuitos según la sección 7. Sin nuestro consentimiento previo por escrito, usted no puede:</p>
<ul>
<li>copiar, reproducir, republicar, distribuir, vender, licenciar o explotar comercialmente ningún contenido;</li>
<li>usar un diseño, render o plano como base para construir, para un portafolio que compita con el nuestro, o en una propuesta a un tercero;</li>
<li>usar nuestro contenido para entrenar, ajustar o evaluar modelos de inteligencia artificial, ni extraer datos del Sitio por medios automatizados;</li>
<li>eliminar, ocultar o alterar créditos, marcas de agua o avisos de derechos de autor;</li>
<li>usar el nombre, el logo o la mascota de Studio Valentina de forma que sugiera respaldo o asociación.</li>
</ul>
<p>Los nombres, logos y marcas de terceros que aparecen en el Sitio pertenecen a sus respectivos titulares y se usan solo para identificarlos. Si considera que algún contenido del Sitio vulnera sus derechos, escriba a <a href="mailto:{EMAIL}">{EMAIL}</a> identificando el material y su reclamación, y la revisaremos con prontitud.</p>

<h2>7. Recursos y plantillas gratuitas</h2>
<p>Studio Valentina ofrece recursos descargables como guías, listas de chequeo, hojas de cálculo, plantillas de moodboard e ilustraciones (los "Recursos"), normalmente a cambio de su nombre y su correo electrónico.</p>
<p>Sujeto a estos Términos, usted recibe una licencia perpetua, mundial y no exclusiva para usar los Recursos <strong>con fines personales o internos de su negocio</strong>, incluidos sus propios proyectos y sus propios clientes. Puede adaptar una plantilla a su proyecto y compartir el resultado con su cliente.</p>
<p>No puede revender, redistribuir, sublicenciar, publicar ni compartir los archivos de los Recursos, en todo o en parte; ofrecerlos para descarga; incluirlos en un producto, paquete, curso o biblioteca de plantillas; presentarlos como trabajo propio; ni quitarles la identidad de Studio Valentina. Los Recursos se entregan "tal cual", sin garantía, y no sustituyen la asesoría profesional.</p>

<h2>8. Lo que usted nos envía</h2>
<p>Cuando nos escribe por el Sitio, WhatsApp, correo electrónico o el Portal de Clientes, usted es responsable de la exactitud y la legalidad de lo que envía, y confirma que tiene derecho a compartirlo. Por favor no envíe material confidencial, sensible o reservado antes de que exista un acuerdo escrito o un acuerdo de confidencialidad; la información enviada antes de ese momento no se trata como confidencial, aunque se maneja conforme a nuestra <a onclick="showPage('privacy')">Política de Privacidad</a>.</p>
<p>Si nos envía sugerencias, ideas o comentarios sobre el Sitio o nuestros servicios, nos otorga el derecho gratuito, perpetuo e irrevocable de usarlos sin obligación ni compensación.</p>

<h2>9. Portal de Clientes</h2>
<p>El Portal de Clientes está reservado a clientes invitados por Studio Valentina. Usted es responsable de mantener sus credenciales en reserva, de todo lo que ocurra a través de su cuenta y de avisarnos de inmediato a <a href="mailto:{EMAIL}">{EMAIL}</a> si sospecha de un acceso no autorizado.</p>
<p>La información del Portal — fases, estado, próximos pasos, actualizaciones y documentos — es un resumen de conveniencia que se mantiene manualmente. Puede estar incompleta o desactualizada y no reemplaza su acuerdo firmado, los documentos oficiales del proyecto, el juego de planos aprobado ni las comunicaciones de su contratista o de la autoridad competente. Si el Portal y su acuerdo escrito difieren, prevalece el acuerdo.</p>
<p>Podemos suspender, modificar o cerrar el acceso al Portal, incluso al terminar un proyecto o si se hace un uso indebido de una cuenta.</p>

<h2>10. Comunicaciones</h2>
<p>Cuando nos escribe por correo, por el formulario de contacto o por WhatsApp, acepta que respondamos por el mismo medio. Si marca la casilla para recibir consejos de diseño y nuevos recursos, puede darse de baja en cualquier momento con el enlace incluido en esos mensajes o escribiendo a <a href="mailto:{EMAIL}">{EMAIL}</a>. Los mensajes relacionados con un proyecto, una cotización o una descarga que usted solicitó son transaccionales y se envían con independencia de sus preferencias de marketing. Pueden aplicarse las tarifas de datos o mensajes de su operador.</p>

<h2>11. Sitios y servicios de terceros</h2>
<p>El Sitio enlaza y se apoya en servicios de terceros, entre ellos LinkedIn, WhatsApp (Meta), Google (Fonts, Analytics y Firebase) y GitHub Pages. No controlamos esos servicios, no respondemos por su contenido, disponibilidad ni prácticas, y su uso se rige por los términos y las políticas de privacidad de cada uno.</p>

<h2>12. Disponibilidad y cambios del Sitio</h2>
<p>Procuramos mantener el Sitio disponible, pero no garantizamos un acceso ininterrumpido ni libre de errores. Podemos modificar, suspender, restringir o descontinuar el Sitio, cualquier Recurso o el Portal de Clientes en cualquier momento, con o sin aviso, y podemos corregir contenidos sin obligación de conservar versiones anteriores.</p>

<h2>13. Exclusión de garantías</h2>
<p>El Sitio, su contenido, los Recursos y el Portal de Clientes se ofrecen "tal cual" y "según disponibilidad", sin garantías de ningún tipo, expresas, implícitas o legales, incluidas las garantías implícitas de comerciabilidad, idoneidad para un fin determinado, titularidad, exactitud y no infracción. No garantizamos que el Sitio sea seguro, ininterrumpido, libre de errores o de componentes dañinos, ni que algún contenido, cifra, plazo o referencia normativa esté vigente, completo o sea aplicable a su proyecto.</p>
<p>Las imágenes del Sitio, incluidos renders y visualizaciones, son ilustrativas. Pueden mostrar acabados, mobiliario, paisajismo, iluminación o entornos que no forman parte de un resultado construido, y no constituyen una garantía de resultado.</p>

<h2>14. Limitación de responsabilidad</h2>
<p>En la máxima medida permitida por la ley, Studio Valentina y Valentina Arboleda no serán responsables por daños indirectos, incidentales, especiales, consecuenciales, ejemplares o punitivos, ni por lucro cesante, pérdida de ingresos, datos, negocio, reputación o ahorros previstos, derivados de su uso o imposibilidad de uso del Sitio, los Recursos o el Portal de Clientes, incluso si se nos advirtió de esa posibilidad.</p>
<p>En la máxima medida permitida por la ley, nuestra responsabilidad total acumulada por todas las reclamaciones relativas al Sitio, los Recursos o el Portal de Clientes no excederá de cien dólares estadounidenses (US$100) o del monto que usted nos haya pagado por acceder al elemento que origina la reclamación, el que sea mayor. Esta limitación no aplica a la responsabilidad derivada de un contrato de servicios firmado, que se rige por ese contrato, ni a la responsabilidad que no pueda limitarse o excluirse conforme a la ley aplicable.</p>
<p>Algunas jurisdicciones no permiten ciertas exclusiones o limitaciones, por lo que partes de esta sección podrían no aplicarle.</p>

<h2>15. Indemnidad</h2>
<p>Usted se obliga a mantener indemne a Studio Valentina y a Valentina Arboleda frente a cualquier reclamación, pérdida, responsabilidad, costo o gasto, incluidos honorarios legales razonables, derivados del uso indebido del Sitio o de los Recursos, del incumplimiento de estos Términos o de la vulneración de una ley o de un derecho de un tercero.</p>

<h2>16. Suspensión y terminación</h2>
<p>Podemos restringir o terminar su acceso al Sitio, a un Recurso o al Portal de Clientes en cualquier momento si creemos razonablemente que ha incumplido estos Términos o que su uso perjudica el Sitio, a nuestros clientes o a un tercero. Las secciones que por su naturaleza deban subsistir — propiedad intelectual, exclusión de garantías, limitación de responsabilidad, indemnidad y ley aplicable — seguirán vigentes.</p>

<h2>17. Ley aplicable y controversias</h2>
<p>Estos Términos se rigen por las leyes del Estado de Georgia, Estados Unidos, sin aplicar sus normas de conflicto de leyes. Antes de iniciar cualquier procedimiento formal, usted acepta escribirnos a <a href="mailto:{EMAIL}">{EMAIL}</a> e intentar de buena fe resolver el asunto de manera informal durante al menos treinta (30) días.</p>
<p>Si el asunto no se resuelve, usted y Studio Valentina acuerdan que los tribunales estatales y federales ubicados en el Estado de Georgia tendrán jurisdicción exclusiva, y usted consiente ese foro. Si accede al Sitio desde fuera de Estados Unidos, lo hace por iniciativa propia y es responsable de cumplir la ley de su país.</p>

<h2>18. Disposiciones generales</h2>
<p>Si alguna cláusula de estos Términos resulta inejecutable, el resto continúa vigente y esa cláusula se aplicará en la mayor medida permitida. El hecho de no exigir el cumplimiento de una cláusula no implica renuncia a ella. Usted no puede ceder estos Términos; nosotros podemos cederlos en el marco de una reorganización o transferencia del negocio. Estos Términos, junto con la Política de Privacidad, la Política de Cookies y cualquier acuerdo firmado, constituyen el acuerdo completo entre las partes respecto del Sitio. En caso de discrepancia entre versiones, prevalece la versión en inglés.</p>

<h2>19. Cambios en estos Términos</h2>
<p>Podemos actualizar estos Términos. La fecha de actualización que aparece arriba indica la versión vigente, y el uso continuado del Sitio después de un cambio significa que acepta la versión actualizada. Los cambios importantes se publicarán de forma visible en esta página.</p>

<h2>20. Contacto</h2>
<p>Studio Valentina — Valentina Arboleda<br>
Peachtree City, Georgia, Estados Unidos<br>
Correo: <a href="mailto:{EMAIL}">{EMAIL}</a><br>
WhatsApp: +1 (678) 490-5574</p>
"""

# ──────────────────────────── PRIVACY (EN) ────────────────────────────
PRIVACY_EN_BODY = f"""
<h2>1. Scope and who is responsible</h2>
<p>This Privacy Policy explains what personal information studio-valentina.com (the "Site") collects, why, how it is used and shared, how long it is kept and what rights you have. It covers the Site, the contact form, the free-resource download form, the Client Portal and messages you send us by email or WhatsApp.</p>
<p>The controller of your information is Valentina Arboleda, doing business as Studio Valentina, Peachtree City, Georgia, United States. For any question or request, write to <a href="mailto:{EMAIL}">{EMAIL}</a>.</p>

<h2>2. Information you give us</h2>
<ul>
<li><strong>Contact requests.</strong> Your name, email, phone number and whatever you choose to tell us about your project through the contact form, email or WhatsApp.</li>
<li><strong>Free resources.</strong> Your first name, email, which resource you asked for, whether you opted in to future emails, and the date of the request.</li>
<li><strong>Client Portal.</strong> Your email address, an encrypted password managed by Google Firebase Authentication, and the project information we publish for you: project name, phase, status, next steps, updates and links to documents.</li>
<li><strong>Project material.</strong> Anything you send during an engagement, such as plans, surveys, photographs, measurements, addresses or preferences.</li>
</ul>
<p>We do not ask for, and ask you not to send, payment card numbers, government identification numbers, health information or other sensitive categories through the Site.</p>

<h2>3. Information collected automatically</h2>
<ul>
<li><strong>Server and security logs.</strong> Our host records technical data such as IP address, date and time, pages requested, referring page, browser and device type, for delivery, security and abuse prevention.</li>
<li><strong>Cookies and similar technologies.</strong> Strictly necessary storage is used on every visit; analytics cookies are used only if you accept them. Full detail is in our <a onclick="showPage('cookies')">Cookie Policy</a>.</li>
<li><strong>Analytics.</strong> If you accept analytics, Google Analytics 4 collects pages visited, time on page, approximate location derived from a truncated IP address, device and browser type, and how you reached the Site. We use it in aggregate and do not try to identify you from it.</li>
</ul>

<h2>4. Why we use your information</h2>
<ul>
<li>To answer your message, prepare a proposal and discuss a possible project.</li>
<li>To deliver the free resource you requested and, if you opted in, to send occasional design tips and new resources.</li>
<li>To provide and maintain the Client Portal and share project progress with clients.</li>
<li>To perform a contract with you and keep the records a business must keep for accounting, tax, insurance and legal purposes.</li>
<li>To operate, secure and improve the Site, detect abuse and fix problems.</li>
<li>To comply with the law and to establish, exercise or defend legal claims.</li>
</ul>
<p>We do <strong>not</strong> sell or rent your personal information, we do not share it for cross-context behavioural advertising, and we do not use it for automated decision-making or profiling that produces legal or similarly significant effects.</p>

<h2>5. Legal bases (visitors in the EEA, the UK and Spain)</h2>
<p>Where the EU or UK General Data Protection Regulation applies, we rely on: your <em>consent</em> for analytics cookies and marketing emails, which you may withdraw at any time; the <em>performance of a contract</em> or steps taken at your request before entering one, for proposals, projects and the Client Portal; our <em>legitimate interests</em> in running and securing the Site and responding to enquiries, balanced against your rights; and <em>legal obligations</em> for records we must keep.</p>

<h2>6. Who we share it with</h2>
<p>We share personal information only with providers that help us operate, and only as needed. Each processes data under its own terms:</p>
<ul>
<li><strong>GitHub Pages</strong> (GitHub, Inc.) — hosting and delivery of the Site.</li>
<li><strong>Google Firebase</strong> (Google LLC) — authentication and database for the Client Portal and for resource download records.</li>
<li><strong>Google Analytics</strong> (Google LLC) — usage statistics, only with your consent.</li>
<li><strong>Google Fonts</strong> (Google LLC) — typography; loading a font involves a request to Google's servers.</li>
<li><strong>Google Translate</strong> (Google LLC) — optional on-page translation when you choose a language other than the ones we publish.</li>
<li><strong>WhatsApp / Meta Platforms</strong> — if you choose to write to us on WhatsApp.</li>
<li><strong>Email provider</strong> — to receive and answer your messages.</li>
</ul>
<p>We may also disclose information if required by law, court order or a valid request from a public authority; to protect our rights, safety or property or those of others; or in connection with a reorganization, merger or sale of the business, in which case we will require the recipient to honour this Policy.</p>

<h2>7. International transfers</h2>
<p>Studio Valentina operates from the United States, and our providers process data in the United States and other countries. If you are in the European Economic Area, the United Kingdom, Colombia, Mexico or elsewhere outside the United States, your information will be transferred to and processed in the United States, where data protection law may differ from your own. Where required, our providers rely on recognized transfer mechanisms such as the European Commission's Standard Contractual Clauses.</p>

<h2>8. How long we keep it</h2>
<ul>
<li><strong>Enquiries that do not become projects:</strong> up to 24 months from the last contact.</li>
<li><strong>Resource download records:</strong> until you unsubscribe or ask us to delete them, and in any case reviewed every 24 months.</li>
<li><strong>Client and project records:</strong> for the duration of the engagement and up to 7 years afterwards, for accounting, tax, insurance and professional-liability reasons.</li>
<li><strong>Client Portal accounts:</strong> while the project is active and for a reasonable period after completion, then closed on request or on our own review.</li>
<li><strong>Analytics data:</strong> retained by Google under the retention period set in our Analytics property.</li>
</ul>
<p>When information is no longer needed, we delete it or keep it in anonymous form.</p>

<h2>9. Security</h2>
<p>We use reasonable technical and organizational measures to protect your information, including encrypted connections (HTTPS), access restricted to accounts that need it, encrypted password storage managed by Firebase Authentication, and database rules that let a Client Portal user read only their own record. No method of transmission or storage is completely secure, so we cannot guarantee absolute security. If a breach affects your personal information, we will notify you and the competent authority where the law requires it.</p>

<h2>10. Your rights</h2>
<p>Depending on where you live, you may have the right to: know what personal information we hold and obtain a copy; correct inaccurate information; request deletion; restrict or object to certain processing; withdraw consent at any time; receive your information in a portable format; and not be discriminated against for exercising these rights.</p>
<p>Residents of U.S. states with comprehensive privacy laws — including California, Virginia, Colorado, Connecticut, Utah, Texas and others — may exercise the rights those laws grant, including the right to appeal a refusal. Georgia does not currently have a comprehensive consumer privacy statute, but we extend these rights to all visitors.</p>
<p>To exercise any right, write to <a href="mailto:{EMAIL}">{EMAIL}</a> from the email address concerned, or tell us how we can verify your identity. We answer within 30 days, or 45 days where the law allows an extension and we tell you why. You may use an authorized agent where the law permits. If you are in the EEA or the UK, you may also complain to your national supervisory authority.</p>

<h2>11. Marketing emails</h2>
<p>We only send marketing messages if you asked for them. Every such message includes an unsubscribe link, and you can also write to <a href="mailto:{EMAIL}">{EMAIL}</a>. Unsubscribing does not stop messages about a project, a proposal or a download you requested.</p>

<h2>12. Do Not Track and Global Privacy Control</h2>
<p>The Site honours the Global Privacy Control (GPC) signal: if your browser sends it, analytics cookies are not loaded and your choice is recorded as "essential only," without you having to click anything. Browsers also send a "Do Not Track" signal that has no agreed standard; because we honour GPC and load analytics only with consent, no further action is needed.</p>

<h2>13. Children</h2>
<p>The Site is not directed to children under 13, and we do not knowingly collect their personal information. If you believe a child has given us information, write to <a href="mailto:{EMAIL}">{EMAIL}</a> and we will delete it.</p>

<h2>14. Third-party links</h2>
<p>The Site links to third-party services such as LinkedIn and WhatsApp. This Policy does not cover them; please read their own privacy policies before sharing information there.</p>

<h2>15. Changes to this Policy</h2>
<p>We may update this Policy to reflect changes in our practices or in the law. The "last updated" date above shows the current version. If a change is material, we will make it visible on this page before it takes effect.</p>

<h2>16. Contact</h2>
<p>Studio Valentina — Valentina Arboleda<br>
Peachtree City, Georgia, United States<br>
Email: <a href="mailto:{EMAIL}">{EMAIL}</a><br>
WhatsApp: +1 (678) 490-5574</p>
"""

# ──────────────────────────── PRIVACY (ES) ────────────────────────────
PRIVACY_ES_BODY = f"""
<h2>1. Alcance y responsable</h2>
<p>Esta Política de Privacidad explica qué información personal recoge studio-valentina.com (el "Sitio"), para qué, cómo se usa y se comparte, cuánto tiempo se conserva y qué derechos tiene usted. Cubre el Sitio, el formulario de contacto, el formulario de descarga de recursos gratuitos, el Portal de Clientes y los mensajes que nos envíe por correo electrónico o WhatsApp.</p>
<p>La responsable del tratamiento es Valentina Arboleda, que opera comercialmente como Studio Valentina, en Peachtree City, Georgia, Estados Unidos. Para cualquier consulta o solicitud, escriba a <a href="mailto:{EMAIL}">{EMAIL}</a>.</p>

<h2>2. Información que usted nos entrega</h2>
<ul>
<li><strong>Solicitudes de contacto.</strong> Su nombre, correo, teléfono y lo que decida contarnos sobre su proyecto por el formulario, el correo o WhatsApp.</li>
<li><strong>Recursos gratuitos.</strong> Su nombre, su correo, qué recurso solicitó, si aceptó recibir correos y la fecha de la solicitud.</li>
<li><strong>Portal de Clientes.</strong> Su correo, una contraseña cifrada gestionada por Google Firebase Authentication y la información del proyecto que publicamos para usted: nombre del proyecto, fase, estado, próximos pasos, actualizaciones y enlaces a documentos.</li>
<li><strong>Material del proyecto.</strong> Lo que nos envíe durante un encargo: planos, levantamientos, fotografías, medidas, direcciones o preferencias.</li>
</ul>
<p>No solicitamos, y le pedimos que no envíe por el Sitio, números de tarjetas de pago, documentos de identidad, información de salud ni otras categorías sensibles.</p>

<h2>3. Información que se recoge automáticamente</h2>
<ul>
<li><strong>Registros del servidor y de seguridad.</strong> El proveedor de alojamiento registra datos técnicos como dirección IP, fecha y hora, páginas solicitadas, página de origen, navegador y tipo de dispositivo, para la entrega del Sitio, su seguridad y la prevención de abusos.</li>
<li><strong>Cookies y tecnologías similares.</strong> El almacenamiento estrictamente necesario se usa en cada visita; las cookies de analítica solo se usan si usted las acepta. El detalle completo está en nuestra <a onclick="showPage('cookies')">Política de Cookies</a>.</li>
<li><strong>Analítica.</strong> Si acepta la analítica, Google Analytics 4 recoge páginas vistas, tiempo en la página, ubicación aproximada derivada de una IP truncada, tipo de dispositivo y navegador, y cómo llegó al Sitio. La usamos de forma agregada y no intentamos identificarle a partir de ella.</li>
</ul>

<h2>4. Para qué usamos su información</h2>
<ul>
<li>Para responder su mensaje, preparar una propuesta y conversar sobre un posible proyecto.</li>
<li>Para entregarle el recurso gratuito que pidió y, si lo aceptó, enviarle de vez en cuando consejos de diseño y nuevos recursos.</li>
<li>Para operar y mantener el Portal de Clientes y compartir el avance del proyecto.</li>
<li>Para ejecutar un contrato con usted y conservar los registros que un negocio debe guardar por razones contables, tributarias, de seguros y legales.</li>
<li>Para operar, asegurar y mejorar el Sitio, detectar abusos y corregir fallas.</li>
<li>Para cumplir la ley y para ejercer o defender reclamaciones legales.</li>
</ul>
<p><strong>No</strong> vendemos ni alquilamos su información personal, no la compartimos para publicidad conductual entre contextos y no la usamos para decisiones automatizadas ni para elaboración de perfiles con efectos jurídicos o similares.</p>

<h2>5. Bases legales (visitantes del EEE, Reino Unido y España)</h2>
<p>Cuando aplica el Reglamento General de Protección de Datos de la UE o del Reino Unido, nos basamos en: su <em>consentimiento</em> para las cookies de analítica y los correos de marketing, que puede retirar en cualquier momento; la <em>ejecución de un contrato</em> o las gestiones previas a su solicitud, para propuestas, proyectos y el Portal de Clientes; nuestro <em>interés legítimo</em> en operar y asegurar el Sitio y en responder consultas, ponderado con sus derechos; y las <em>obligaciones legales</em> respecto de los registros que debemos conservar.</p>

<h2>6. Con quién la compartimos</h2>
<p>Compartimos información personal solo con proveedores que nos ayudan a operar, y solo en lo necesario. Cada uno trata los datos bajo sus propias condiciones:</p>
<ul>
<li><strong>GitHub Pages</strong> (GitHub, Inc.) — alojamiento y entrega del Sitio.</li>
<li><strong>Google Firebase</strong> (Google LLC) — autenticación y base de datos del Portal de Clientes y de los registros de descarga de recursos.</li>
<li><strong>Google Analytics</strong> (Google LLC) — estadísticas de uso, solo con su consentimiento.</li>
<li><strong>Google Fonts</strong> (Google LLC) — tipografías; cargar una fuente implica una solicitud a los servidores de Google.</li>
<li><strong>Google Translate</strong> (Google LLC) — traducción opcional de la página cuando elige un idioma distinto a los que publicamos.</li>
<li><strong>WhatsApp / Meta Platforms</strong> — si decide escribirnos por WhatsApp.</li>
<li><strong>Proveedor de correo electrónico</strong> — para recibir y responder sus mensajes.</li>
</ul>
<p>También podemos revelar información si lo exige la ley, una orden judicial o una solicitud válida de una autoridad pública; para proteger nuestros derechos, seguridad o bienes o los de terceros; o en el marco de una reorganización, fusión o venta del negocio, en cuyo caso exigiremos al receptor respetar esta Política.</p>

<h2>7. Transferencias internacionales</h2>
<p>Studio Valentina opera desde Estados Unidos y nuestros proveedores tratan datos en Estados Unidos y en otros países. Si usted está en el Espacio Económico Europeo, el Reino Unido, Colombia, México o fuera de Estados Unidos, su información se transferirá y tratará en Estados Unidos, donde la normativa de protección de datos puede diferir de la suya. Cuando corresponde, nuestros proveedores se apoyan en mecanismos de transferencia reconocidos, como las Cláusulas Contractuales Tipo de la Comisión Europea.</p>

<h2>8. Cuánto tiempo la conservamos</h2>
<ul>
<li><strong>Consultas que no se convierten en proyecto:</strong> hasta 24 meses desde el último contacto.</li>
<li><strong>Registros de descarga de recursos:</strong> hasta que se dé de baja o nos pida eliminarlos, y en todo caso se revisan cada 24 meses.</li>
<li><strong>Registros de clientes y proyectos:</strong> durante el encargo y hasta 7 años después, por razones contables, tributarias, de seguros y de responsabilidad profesional.</li>
<li><strong>Cuentas del Portal de Clientes:</strong> mientras el proyecto esté activo y por un periodo razonable después, y luego se cierran a solicitud o por revisión nuestra.</li>
<li><strong>Datos de analítica:</strong> los conserva Google según el periodo de retención configurado en nuestra propiedad de Analytics.</li>
</ul>
<p>Cuando la información deja de ser necesaria, la eliminamos o la conservamos de forma anónima.</p>

<h2>9. Seguridad</h2>
<p>Aplicamos medidas técnicas y organizativas razonables para proteger su información: conexiones cifradas (HTTPS), acceso restringido a las cuentas que lo necesitan, almacenamiento cifrado de contraseñas gestionado por Firebase Authentication y reglas de base de datos que permiten a cada usuario del Portal leer únicamente su propio registro. Ningún método de transmisión o almacenamiento es completamente seguro, por lo que no podemos garantizar una seguridad absoluta. Si una brecha afecta su información personal, se lo notificaremos a usted y a la autoridad competente cuando la ley lo exija.</p>

<h2>10. Sus derechos</h2>
<p>Según dónde viva, puede tener derecho a: saber qué información personal tenemos y obtener una copia; corregir información inexacta; solicitar su eliminación; limitar u oponerse a ciertos tratamientos; retirar su consentimiento en cualquier momento; recibir su información en un formato portable; y a no ser discriminado por ejercer estos derechos.</p>
<p>Los residentes de estados de EE.UU. con leyes integrales de privacidad — California, Virginia, Colorado, Connecticut, Utah, Texas y otros — pueden ejercer los derechos que esas leyes conceden, incluido el de apelar una negativa. Georgia no cuenta hoy con una ley integral de privacidad del consumidor, pero extendemos estos derechos a todos los visitantes.</p>
<p>Para ejercer cualquier derecho, escriba a <a href="mailto:{EMAIL}">{EMAIL}</a> desde el correo correspondiente, o indíquenos cómo verificar su identidad. Respondemos en 30 días, o en 45 cuando la ley permite una prórroga y le explicamos el motivo. Puede actuar por medio de un representante autorizado cuando la ley lo permita. Si está en el EEE o el Reino Unido, también puede presentar una reclamación ante su autoridad de control.</p>

<h2>11. Correos de marketing</h2>
<p>Solo enviamos mensajes de marketing si usted los pidió. Cada mensaje incluye un enlace para darse de baja, y también puede escribir a <a href="mailto:{EMAIL}">{EMAIL}</a>. Darse de baja no detiene los mensajes sobre un proyecto, una propuesta o una descarga que haya solicitado.</p>

<h2>12. Do Not Track y Global Privacy Control</h2>
<p>El Sitio respeta la señal Global Privacy Control (GPC): si su navegador la envía, no se cargan cookies de analítica y su elección se registra como "solo esenciales", sin que usted tenga que hacer clic en nada. Los navegadores también envían la señal "Do Not Track", que no tiene un estándar acordado; como respetamos GPC y solo cargamos analítica con consentimiento, no hace falta ninguna acción adicional.</p>

<h2>13. Menores</h2>
<p>El Sitio no está dirigido a menores de 13 años y no recogemos conscientemente su información personal. Si cree que un menor nos entregó información, escriba a <a href="mailto:{EMAIL}">{EMAIL}</a> y la eliminaremos.</p>

<h2>14. Enlaces a terceros</h2>
<p>El Sitio enlaza a servicios de terceros como LinkedIn y WhatsApp. Esta Política no los cubre; lea sus propias políticas de privacidad antes de compartir información allí.</p>

<h2>15. Cambios en esta Política</h2>
<p>Podemos actualizar esta Política para reflejar cambios en nuestras prácticas o en la ley. La fecha de actualización que aparece arriba indica la versión vigente. Si un cambio es importante, lo publicaremos de forma visible en esta página antes de que entre en vigor.</p>

<h2>16. Contacto</h2>
<p>Studio Valentina — Valentina Arboleda<br>
Peachtree City, Georgia, Estados Unidos<br>
Correo: <a href="mailto:{EMAIL}">{EMAIL}</a><br>
WhatsApp: +1 (678) 490-5574</p>
"""

# ──────────────────────────── COOKIES (EN) ────────────────────────────
COOKIES_EN_BODY = f"""
<h2>1. Acceptance</h2>
<p>When you first visit the Site, a notice lets you accept or decline optional cookies. Strictly necessary storage does not require consent and is used on every visit. Optional cookies are placed only after you click "Accept." You can change your decision at any time in <a onclick="openCookieSettings()">Cookie Settings</a>, and declining does not limit your access to any part of the Site except where a cookie is technically required, such as signing in to the Client Portal.</p>

<h2>2. What cookies and similar technologies are</h2>
<p>Cookies are small text files that a site asks your browser to store on your device, so it can recognise your settings on a later page or visit. "Similar technologies" include local storage, session storage and script tags, which work differently but serve comparable purposes. In this Policy, "cookies" refers to all of them. A cookie is a <em>first-party</em> cookie when it is set by this Site, and a <em>third-party</em> cookie when it is set by another company whose service we load, such as Google.</p>

<h2>3. Categories we use</h2>
<ul>
<li><strong>Strictly necessary.</strong> Stores your cookie choice and, if you sign in to the Client Portal, keeps your secure session. The Site and Portal cannot function properly without these. They cannot be switched off through the Site, but you can block them in your browser.</li>
<li><strong>Language (functional).</strong> If you choose a language other than the two we publish, a <code>googtrans</code> cookie remembers it and Google Translate translates the page automatically. Automatic translations may contain errors; the English version prevails.</li>
<li><strong>Analytics (optional).</strong> If you click "Accept," Google Analytics 4 measures visits, pages viewed, clicks (including WhatsApp button clicks and resource downloads), referring sites, device and browser type, and approximate location derived from a truncated IP address. We use this only in aggregate, to understand which pages are useful and to improve the Site.</li>
</ul>
<p>We do not use advertising, retargeting or social-media tracking cookies, and we do not sell or share your personal information for cross-context behavioural advertising.</p>

<h2>4. The specific cookies and storage we use</h2>
<ul>
<li><strong>sv_cookie_choice</strong> — first party, local storage, strictly necessary. Remembers whether you accepted or declined analytics so the notice is not shown again. Kept until you clear your browser storage.</li>
<li><strong>googtrans</strong> — first party, cookie, functional. Records the language you selected. Kept for the browsing session or until you switch back.</li>
<li><strong>Firebase Authentication storage</strong> — first party, local storage, strictly necessary. Keeps you signed in to the Client Portal and is cleared when you sign out.</li>
<li><strong>_ga</strong> — third party (Google), analytics, optional. Distinguishes one browser from another. Up to 2 years.</li>
<li><strong>_ga_&lt;container-id&gt;</strong> — third party (Google), analytics, optional. Maintains the session state for Google Analytics 4. Up to 2 years.</li>
</ul>
<p>Names and durations are set by the providers and may change. If you want to see exactly what is stored during a visit, your browser's developer tools list every cookie and storage key for this Site.</p>

<h2>5. Third-party services</h2>
<p>Some technologies are provided by independent third parties, including Google LLC (Google Analytics, Google Fonts, Google Translate and Firebase), GitHub, Inc. (hosting), Meta Platforms, Inc. (WhatsApp) and LinkedIn Corporation. These parties may collect information, including your IP address, under their own terms and privacy policies, which we do not control. Studio Valentina is not responsible for the content, practices, availability or security of third-party services, and your use of them is at your own risk. Links to third-party sites are provided for convenience and do not constitute endorsement.</p>

<h2>6. Your choices</h2>
<ul>
<li>Change your decision at any time in <a onclick="openCookieSettings()">Cookie Settings</a>. Withdrawing consent stops future analytics collection but does not delete data already collected; to request deletion, write to us.</li>
<li>If your browser sends a <strong>Global Privacy Control</strong> signal, we treat it as a refusal of optional cookies, automatically and without any action from you.</li>
<li>You can block or delete cookies in your browser settings, use a private window, or install Google's Analytics opt-out browser add-on. Blocking strictly necessary storage may prevent you from signing in to the Client Portal or may cause the cookie notice to appear on every visit.</li>
</ul>

<h2>7. Legal basis and your rights</h2>
<p>Where the EU or UK General Data Protection Regulation applies, strictly necessary cookies rely on our legitimate interest in operating a secure Site, and analytics and functional cookies rely on your consent, which you may withdraw at any time. Your rights of access, correction, deletion, objection and portability, and how to exercise them, are described in our <a onclick="showPage('privacy')">Privacy Policy</a>.</p>

<h2>8. No warranty</h2>
<p>The Site and any cookie-based features are provided "as is" and "as available," without warranties of any kind, express or implied, including accuracy, availability, merchantability, fitness for a particular purpose or non-infringement. Analytics figures are estimates and are not guaranteed to be complete or accurate.</p>

<h2>9. Limitation of liability</h2>
<p>To the fullest extent permitted by applicable law, Studio Valentina and Valentina Arboleda shall not be liable for any indirect, incidental, special, consequential or punitive damages, or for any loss of data, profits or goodwill, arising out of or related to cookies, similar technologies, third-party services, or your use of or inability to use the Site, even if advised of the possibility of such damages. Where liability cannot be excluded, it is limited to the greatest extent permitted by law.</p>

<h2>10. Indemnity</h2>
<p>You agree to indemnify and hold harmless Studio Valentina and Valentina Arboleda from any claims, losses or expenses, including reasonable attorneys' fees, arising from your misuse of the Site, your violation of this Policy, or any attempt to tamper with, circumvent or interfere with the Site's cookies, security or Client Portal.</p>

<h2>11. Data security</h2>
<p>We use reasonable measures provided by our hosting and service providers to protect information, including encrypted connections. However, no method of transmission or storage over the internet is completely secure, and we cannot guarantee absolute security.</p>

<h2>12. Children</h2>
<p>The Site is intended for adults and is not directed to children under 13. We do not knowingly collect information from children.</p>

<h2>13. International visitors</h2>
<p>The Site is operated from the United States. If you access it from another country, you understand that information may be processed in the United States, where data protection laws may differ from those of your country.</p>

<h2>14. Changes to this Policy</h2>
<p>We may update this Policy at any time by posting a revised version on this page with a new effective date. Your continued use of the Site after changes are posted constitutes acceptance of the revised Policy.</p>

<h2>15. Governing law and severability</h2>
<p>This Policy is governed by the laws of the State of Georgia, United States, without regard to conflict-of-law rules. Any dispute relating to it shall be brought exclusively in the state or federal courts located in Georgia, and you consent to their jurisdiction. If any provision is found unenforceable, the remaining provisions remain in full force and effect.</p>

<h2>16. Contact</h2>
<p>Questions or requests about cookies: <a href="mailto:{EMAIL}">{EMAIL}</a>.</p>
"""

# ──────────────────────────── COOKIES (ES) ────────────────────────────
COOKIES_ES_BODY = f"""
<h2>1. Aceptación</h2>
<p>En su primera visita al Sitio aparece un aviso que le permite aceptar o rechazar las cookies opcionales. El almacenamiento estrictamente necesario no requiere consentimiento y se usa en cada visita. Las cookies opcionales se instalan solo después de que usted pulse "Aceptar". Puede cambiar su decisión cuando quiera en <a onclick="openCookieSettings()">Configuración de cookies</a>, y rechazarlas no limita su acceso a ninguna parte del Sitio, salvo donde una cookie sea técnicamente necesaria, como al entrar al Portal de Clientes.</p>

<h2>2. Qué son las cookies y las tecnologías similares</h2>
<p>Las cookies son pequeños archivos de texto que un sitio pide a su navegador guardar en su dispositivo, para reconocer sus preferencias en otra página o en una visita posterior. Las "tecnologías similares" incluyen el almacenamiento local, el almacenamiento de sesión y las etiquetas de script, que funcionan distinto pero cumplen fines comparables. En esta Política, "cookies" se refiere a todas ellas. Una cookie es <em>propia</em> cuando la instala este Sitio, y <em>de terceros</em> cuando la instala otra empresa cuyo servicio cargamos, como Google.</p>

<h2>3. Categorías que usamos</h2>
<ul>
<li><strong>Estrictamente necesarias.</strong> Guardan su decisión sobre cookies y, si entra al Portal de Clientes, mantienen su sesión segura. El Sitio y el Portal no funcionan correctamente sin ellas. No se pueden desactivar desde el Sitio, pero sí bloquear en su navegador.</li>
<li><strong>Idioma (funcionales).</strong> Si elige un idioma distinto a los dos que publicamos, una cookie <code>googtrans</code> lo recuerda y Google Translate traduce la página automáticamente. Las traducciones automáticas pueden contener errores; prevalece la versión en inglés.</li>
<li><strong>Analítica (opcionales).</strong> Si pulsa "Aceptar", Google Analytics 4 mide visitas, páginas vistas, clics (incluidos los del botón de WhatsApp y las descargas de recursos), sitios de origen, tipo de dispositivo y navegador, y ubicación aproximada derivada de una IP truncada. Usamos esto solo de forma agregada, para entender qué páginas sirven y mejorar el Sitio.</li>
</ul>
<p>No usamos cookies de publicidad, de retargeting ni de seguimiento de redes sociales, y no vendemos ni compartimos su información personal para publicidad conductual entre contextos.</p>

<h2>4. Cookies y almacenamiento específicos que usamos</h2>
<ul>
<li><strong>sv_cookie_choice</strong> — propia, almacenamiento local, estrictamente necesaria. Recuerda si aceptó o rechazó la analítica para no volver a mostrar el aviso. Se conserva hasta que borre el almacenamiento de su navegador.</li>
<li><strong>googtrans</strong> — propia, cookie, funcional. Registra el idioma que eligió. Dura la sesión de navegación o hasta que vuelva al idioma original.</li>
<li><strong>Almacenamiento de Firebase Authentication</strong> — propia, almacenamiento local, estrictamente necesaria. Lo mantiene con sesión iniciada en el Portal de Clientes y se borra al cerrar sesión.</li>
<li><strong>_ga</strong> — de terceros (Google), analítica, opcional. Distingue un navegador de otro. Hasta 2 años.</li>
<li><strong>_ga_&lt;id-de-contenedor&gt;</strong> — de terceros (Google), analítica, opcional. Mantiene el estado de la sesión en Google Analytics 4. Hasta 2 años.</li>
</ul>
<p>Los nombres y las duraciones los definen los proveedores y pueden cambiar. Si quiere ver exactamente qué se guarda durante una visita, las herramientas de desarrollo de su navegador listan todas las cookies y claves de almacenamiento de este Sitio.</p>

<h2>5. Servicios de terceros</h2>
<p>Algunas tecnologías las prestan terceros independientes, entre ellos Google LLC (Google Analytics, Google Fonts, Google Translate y Firebase), GitHub, Inc. (alojamiento), Meta Platforms, Inc. (WhatsApp) y LinkedIn Corporation. Esos terceros pueden recoger información, incluida su dirección IP, conforme a sus propios términos y políticas de privacidad, que no controlamos. Studio Valentina no responde por el contenido, las prácticas, la disponibilidad ni la seguridad de los servicios de terceros, y su uso corre por su cuenta. Los enlaces a sitios de terceros se ofrecen por conveniencia y no implican respaldo.</p>

<h2>6. Sus opciones</h2>
<ul>
<li>Cambie su decisión cuando quiera en <a onclick="openCookieSettings()">Configuración de cookies</a>. Retirar el consentimiento detiene la recolección futura de analítica, pero no borra los datos ya recogidos; para pedir su eliminación, escríbanos.</li>
<li>Si su navegador envía la señal <strong>Global Privacy Control</strong>, la tratamos como un rechazo de las cookies opcionales, de forma automática y sin que usted haga nada.</li>
<li>Puede bloquear o borrar cookies en la configuración de su navegador, usar una ventana privada o instalar el complemento de inhabilitación de Google Analytics. Bloquear el almacenamiento estrictamente necesario puede impedirle entrar al Portal de Clientes o hacer que el aviso de cookies aparezca en cada visita.</li>
</ul>

<h2>7. Base legal y sus derechos</h2>
<p>Cuando aplica el Reglamento General de Protección de Datos de la UE o del Reino Unido, las cookies estrictamente necesarias se apoyan en nuestro interés legítimo de operar un Sitio seguro, y las de analítica y funcionales en su consentimiento, que puede retirar en cualquier momento. Sus derechos de acceso, rectificación, supresión, oposición y portabilidad, y cómo ejercerlos, están descritos en nuestra <a onclick="showPage('privacy')">Política de Privacidad</a>.</p>

<h2>8. Exclusión de garantías</h2>
<p>El Sitio y cualquier funcionalidad basada en cookies se ofrecen "tal cual" y "según disponibilidad", sin garantías de ningún tipo, expresas o implícitas, incluidas las de exactitud, disponibilidad, comerciabilidad, idoneidad para un fin determinado o no infracción. Las cifras de analítica son estimaciones y no se garantiza que sean completas ni exactas.</p>

<h2>9. Limitación de responsabilidad</h2>
<p>En la máxima medida permitida por la ley aplicable, Studio Valentina y Valentina Arboleda no serán responsables por daños indirectos, incidentales, especiales, consecuenciales o punitivos, ni por pérdida de datos, utilidades o reputación, derivados de las cookies, las tecnologías similares, los servicios de terceros o su uso o imposibilidad de uso del Sitio, incluso si se advirtió de esa posibilidad. Cuando la responsabilidad no pueda excluirse, se limita en la mayor medida permitida por la ley.</p>

<h2>10. Indemnidad</h2>
<p>Usted se obliga a mantener indemne a Studio Valentina y a Valentina Arboleda frente a reclamaciones, pérdidas o gastos, incluidos honorarios legales razonables, derivados del uso indebido del Sitio, del incumplimiento de esta Política o de cualquier intento de manipular, eludir o interferir con las cookies, la seguridad o el Portal de Clientes del Sitio.</p>

<h2>11. Seguridad de los datos</h2>
<p>Aplicamos las medidas razonables que ofrecen nuestros proveedores de alojamiento y de servicios para proteger la información, incluidas las conexiones cifradas. Sin embargo, ningún método de transmisión o almacenamiento en internet es completamente seguro, y no podemos garantizar una seguridad absoluta.</p>

<h2>12. Menores</h2>
<p>El Sitio está dirigido a personas adultas y no a menores de 13 años. No recogemos conscientemente información de menores.</p>

<h2>13. Visitantes internacionales</h2>
<p>El Sitio se opera desde Estados Unidos. Si accede desde otro país, entiende que la información puede tratarse en Estados Unidos, donde la normativa de protección de datos puede diferir de la de su país.</p>

<h2>14. Cambios en esta Política</h2>
<p>Podemos actualizar esta Política en cualquier momento publicando una versión revisada en esta página con una nueva fecha de vigencia. El uso continuado del Sitio después de publicados los cambios constituye aceptación de la Política revisada.</p>

<h2>15. Ley aplicable y divisibilidad</h2>
<p>Esta Política se rige por las leyes del Estado de Georgia, Estados Unidos, sin aplicar sus normas de conflicto de leyes. Cualquier controversia relacionada se someterá exclusivamente a los tribunales estatales o federales ubicados en Georgia, y usted consiente su jurisdicción. Si alguna cláusula resulta inejecutable, las demás permanecen plenamente vigentes.</p>

<h2>16. Contacto</h2>
<p>Consultas o solicitudes sobre cookies: <a href="mailto:{EMAIL}">{EMAIL}</a>.</p>
"""

PAGES = {
    ('index.html', 'page-cookies'): wrap(
        'Legal', 'Cookie <em>Policy</em>',
        f'Effective date: {UPDATED_EN}. This Cookie Policy explains how studio-valentina.com uses cookies and similar technologies, which ones we set, how long they last and how to change your mind. It forms part of, and should be read together with, our <a onclick="showPage(\'terms\')">Terms &amp; Conditions</a> and <a onclick="showPage(\'privacy\')">Privacy Policy</a>.',
        COOKIES_EN_BODY),
    ('es/index.html', 'page-cookies'): wrap(
        'Legal', 'Política de <em>Cookies</em>',
        f'Fecha de vigencia: {UPDATED_ES}. Esta Política de Cookies explica cómo studio-valentina.com usa cookies y tecnologías similares, cuáles instalamos, cuánto duran y cómo cambiar de opinión. Forma parte de, y debe leerse junto con, nuestros <a onclick="showPage(\'terms\')">Términos y Condiciones</a> y nuestra <a onclick="showPage(\'privacy\')">Política de Privacidad</a>.',
        COOKIES_ES_BODY),
    ('index.html', 'page-terms'): wrap(
        'Legal', 'Terms &amp; <em>Conditions</em>',
        f'Last updated: {UPDATED_EN}. These Terms &amp; Conditions govern your use of studio-valentina.com, the free resources published on it and the Client Portal. Please read them before using the Site.',
        TERMS_EN_BODY),
    ('index.html', 'page-privacy'): wrap(
        'Legal', 'Privacy <em>Policy</em>',
        f'Last updated: {UPDATED_EN}. This policy explains what personal information Studio Valentina collects through studio-valentina.com, why, who it is shared with, how long it is kept and what rights you have over it.',
        PRIVACY_EN_BODY),
    ('es/index.html', 'page-terms'): wrap(
        'Legal', 'Términos y <em>Condiciones</em>',
        f'Última actualización: {UPDATED_ES}. Estos Términos y Condiciones regulan el uso de studio-valentina.com, de los recursos gratuitos publicados en el Sitio y del Portal de Clientes. Léalos antes de usar el Sitio.',
        TERMS_ES_BODY),
    ('es/index.html', 'page-privacy'): wrap(
        'Legal', 'Política de <em>Privacidad</em>',
        f'Última actualización: {UPDATED_ES}. Esta política explica qué información personal recoge Studio Valentina a través de studio-valentina.com, para qué, con quién se comparte, cuánto tiempo se conserva y qué derechos tiene usted sobre ella.',
        PRIVACY_ES_BODY),
}


def replace_block(html, page_id, new_wrap):
    """Replace the .sp-wrap inside <div ... id="page-id" ...> with new_wrap."""
    m = re.search(r'<div[^>]*id="%s"[^>]*>' % re.escape(page_id), html)
    if not m:
        raise SystemExit('block not found: ' + page_id)
    open_tag = m.group(0)
    start = m.end()
    # walk to the matching </div> of the page block
    depth, j = 1, start
    while depth:
        nd = html.find('<div', j)
        cd = html.find('</div>', j)
        if cd == -1:
            raise SystemExit('unbalanced html near ' + page_id)
        if nd != -1 and nd < cd:
            depth += 1
            j = nd + 4
        else:
            depth -= 1
            j = cd + 6
    end = j - 6
    # keep the opening tag but drop any lang="en" on the Spanish pages
    open_tag = re.sub(r'\s+lang="en"', '', open_tag)
    return html[:m.start()] + open_tag + new_wrap + html[end:]


def main():
    by_file = {}
    for (fname, page_id), block in PAGES.items():
        by_file.setdefault(fname, []).append((page_id, block))
    for fname, items in by_file.items():
        html = open(fname, encoding='utf-8').read()
        for page_id, block in items:
            html = replace_block(html, page_id, block)
        open(fname, 'w', encoding='utf-8').write(html)
        print(fname, 'updated:', ', '.join(p for p, _ in items))


if __name__ == '__main__':
    main()
