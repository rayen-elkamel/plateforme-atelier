/* Atelier demo: plain JavaScript, mock data, and browser storage.
   The data access functions are intentionally separated so a future API can replace them. */
const COURSES = [
  {
    id: "visual-thinking",
    number: "01",
    title: "Visual Thinking",
    category: "Design",
    level: "Beginner",
    duration: "2h 15m",
    lessons: 3,
    color: "ochre",
    description:
      "Learn to turn loose observations into clear, persuasive visual ideas.",
    instructor: "Mara Ellis",
    outcome:
      "Build a repeatable process for seeing, selecting and communicating ideas.",
    lessonsData: [
      {
        id: "seeing",
        title: "Learning to see",
        duration: "08 min",
        type: "text",
        body: "Good visual work starts before you open a tool. It starts with attention: what is present, what is missing, and what deserves emphasis. Train yourself to notice relationships before reaching for a solution.",
        points: [
          "Observe before you interpret.",
          "Separate the signal from decoration.",
          "Make one clear decision at a time.",
        ],
        quiz: [
          {
            q: "What should happen before choosing a visual solution?",
            options: [
              "Add decoration",
              "Observe and identify relationships",
              "Choose a font",
            ],
            answer: 1,
            explanation:
              "Observation helps you identify what matters before you design.",
          },
          {
            q: "A strong visual hierarchy mainly helps people…",
            options: [
              "Read everything at once",
              "Notice the most important information first",
              "Use more colors",
            ],
            answer: 1,
            explanation: "Hierarchy directs attention in a deliberate order.",
          },
        ],
      },
      {
        id: "composition",
        title: "Composition & tension",
        duration: "12 min",
        type: "video",
        videoUrl: "resources/test_video_hd.mp4",
        body: "Composition is the relationship between elements in a frame. Use scale, alignment, empty space and contrast to create a deliberate reading path.",
        points: [
          "Use contrast to establish a focal point.",
          "Treat empty space as an active element.",
          "Test alignment, then break it with intention.",
        ],
        quiz: [
          {
            q: "What is negative space?",
            options: [
              "A layout mistake",
              "The space around and between elements",
              "A dark background",
            ],
            answer: 1,
            explanation:
              "Negative space gives elements room and clarifies relationships.",
          },
          {
            q: "Why might a designer break alignment?",
            options: [
              "To create intentional tension",
              "To make the layout random",
              "To avoid hierarchy",
            ],
            answer: 0,
            explanation:
              "A deliberate break can create emphasis when the overall system remains clear.",
          },
        ],
      },
      {
        id: "visual-editing",
        title: "The art of editing",
        duration: "10 min",
        type: "text",
        body: "Editing is the act of removing what weakens the message. A useful composition often becomes stronger when one more element is removed, one sentence is shortened, or one competing idea is set aside.",
        points: [
          "Ask what each element contributes.",
          "Remove repetition before adding more.",
          "Review the work at a distance.",
        ],
        quiz: [
          {
            q: "What is the purpose of editing?",
            options: [
              "To add more elements",
              "To remove what weakens the message",
              "To make every area busy",
            ],
            answer: 1,
            explanation:
              "Editing protects the main idea by removing distractions.",
          },
        ],
      },
    ],
  },
  {
    id: "writing-with-clarity",
    number: "02",
    title: "Writing with Clarity",
    category: "Writing",
    level: "All levels",
    duration: "1h 40m",
    lessons: 3,
    color: "ink",
    description:
      "Make complex thoughts easier to understand without making them smaller.",
    instructor: "Jonah Reed",
    outcome: "Write concise, useful messages with a clear point of view.",
    lessonsData: [
      {
        id: "one-idea",
        title: "One idea at a time",
        duration: "07 min",
        type: "text",
        body: "Clarity is a form of generosity. Decide what the reader needs to understand, then give that idea enough space to land. One paragraph does not need to carry every thought you have.",
        points: [
          "Lead with the point.",
          "Keep supporting ideas close to the claim.",
          "Move secondary detail out of the way.",
        ],
        quiz: [
          {
            q: "A clear paragraph should usually…",
            options: [
              "Carry many unrelated ideas",
              "Develop one main idea",
              "Hide the main point at the end",
            ],
            answer: 1,
            explanation: "One central idea makes a paragraph easier to follow.",
          },
        ],
      },
      {
        id: "cutting",
        title: "Cutting without losing meaning",
        duration: "11 min",
        type: "video",
        videoUrl: "resources/test_video_hd.mp4",
        body: "Concise writing is not simply short writing. It keeps the words that do real work and removes the ones that slow the reader down.",
        points: [
          "Replace filler with a direct verb.",
          "Keep necessary context.",
          "Read the sentence aloud.",
        ],
        quiz: [
          {
            q: "Good editing removes…",
            options: [
              "All detail",
              "Words that do not help the reader",
              "Every long word",
            ],
            answer: 1,
            explanation:
              "The goal is useful precision, not brevity at any cost.",
          },
        ],
      },
      {
        id: "final-pass",
        title: "The final pass",
        duration: "09 min",
        type: "text",
        body: "A final pass is not just proofreading. Check whether the order makes sense, whether the reader knows what to do next, and whether every sentence earns its place.",
        points: [
          "Check the order of ideas.",
          "Make the next step explicit.",
          "Proofread after structural edits.",
        ],
        quiz: [
          {
            q: "When is the best time to proofread?",
            options: [
              "Before organizing the ideas",
              "After structural edits",
              "Instead of editing",
            ],
            answer: 1,
            explanation:
              "Proofreading is most useful once the content and structure are stable.",
          },
        ],
      },
    ],
  },
  {
    id: "creative-systems",
    number: "03",
    title: "Creative Systems",
    category: "Business",
    level: "Intermediate",
    duration: "3h 05m",
    lessons: 3,
    color: "lilac",
    description:
      "Build a practical creative process that can survive real-world constraints.",
    instructor: "Leila Park",
    outcome: "Create a lightweight system for briefs, feedback and iteration.",
    lessonsData: [
      {
        id: "brief",
        title: "A useful brief",
        duration: "10 min",
        type: "text",
        body: "A brief is a decision-making tool, not a ceremonial document. It should define the problem, the audience, the constraints and what success will look like.",
        points: [
          "Define the problem in plain language.",
          "Name the real audience.",
          "Agree on what success means.",
        ],
        quiz: [
          {
            q: "A useful brief should define…",
            options: [
              "Only the visual style",
              "Problem, audience, constraints and success",
              "Every detail of the final result",
            ],
            answer: 1,
            explanation:
              "A brief creates shared understanding without prescribing every move.",
          },
        ],
      },
      {
        id: "feedback",
        title: "Feedback that moves work forward",
        duration: "14 min",
        type: "video",
        videoUrl: "resources/test_video_hd.mp4",
        body: "Useful feedback points to the goal and describes the gap between the current work and that goal. It avoids taste-only statements and suggests a direction for the next iteration.",
        points: [
          "Tie feedback to the agreed goal.",
          "Describe the issue, not the person.",
          "Make the next action clear.",
        ],
        quiz: [
          {
            q: "Helpful feedback should be connected to…",
            options: [
              "The agreed goal",
              "Personal taste alone",
              "The number of revisions",
            ],
            answer: 0,
            explanation:
              "Shared goals make feedback actionable and less subjective.",
          },
        ],
      },
      {
        id: "iteration",
        title: "Small, deliberate iterations",
        duration: "12 min",
        type: "text",
        body: "Iteration is most useful when each version tests a question. Change a small number of things, observe what improved, and document the decision so the team can move forward.",
        points: [
          "Test a clear question.",
          "Change only what you need to evaluate.",
          "Record the reason for a decision.",
        ],
        quiz: [
          {
            q: "A deliberate iteration should test…",
            options: [
              "Everything at once",
              "A clear question",
              "Whether the team can avoid decisions",
            ],
            answer: 1,
            explanation:
              "A clear question makes the result of an iteration easier to evaluate.",
          },
        ],
      },
    ],
  },
  {
    id: "photography-light",
    number: "04",
    title: "Photography & Light",
    category: "Photography",
    level: "Beginner",
    duration: "2h 30m",
    lessons: 3,
    color: "cream",
    description:
      "Understand light, shape and atmosphere before you touch the edit.",
    instructor: "Nico Flores",
    outcome: "Read natural light and make more intentional photographs.",
    lessonsData: [
      {
        id: "direction",
        title: "Reading light direction",
        duration: "09 min",
        type: "text",
        body: "Light direction changes the shape of a subject. Front light reveals detail, side light creates texture, and backlight can separate a subject from its surroundings.",
        points: [
          "Move around the subject before moving the camera.",
          "Notice the direction of shadows.",
          "Choose light for the mood you want.",
        ],
        quiz: [
          {
            q: "Side light is especially useful for revealing…",
            options: ["Texture", "Only flat color", "No shadows"],
            answer: 0,
            explanation:
              "Side light creates small shadows that reveal surface texture.",
          },
        ],
      },
      {
        id: "exposure",
        title: "Exposure as a decision",
        duration: "13 min",
        type: "video",
        videoUrl: "resources/test_video_hd.mp4",
        body: "Exposure is not simply a technical target. It is a creative choice about what should remain visible and how the image should feel.",
        points: [
          "Protect important highlights.",
          "Use exposure compensation intentionally.",
          "Review the image, not just the meter.",
        ],
        quiz: [
          {
            q: "Exposure should be chosen based on…",
            options: [
              "The meter alone",
              "The image's intent and important details",
              "A fixed setting for every scene",
            ],
            answer: 1,
            explanation:
              "The meter is a guide; the desired image determines the decision.",
          },
        ],
      },
      {
        id: "sequence",
        title: "Build a visual sequence",
        duration: "10 min",
        type: "text",
        body: "A sequence becomes meaningful through contrast and rhythm. Wide frames establish context, close frames reveal detail, and recurring shapes help images speak to each other.",
        points: [
          "Mix wide, medium and close views.",
          "Look for recurring shapes or colors.",
          "Sequence for rhythm, not chronology alone.",
        ],
        quiz: [
          {
            q: "A visual sequence can be strengthened by…",
            options: [
              "Using the same frame every time",
              "Creating contrast and rhythm",
              "Ignoring relationships between images",
            ],
            answer: 1,
            explanation:
              "Variation creates a rhythm that helps images relate to one another.",
          },
        ],
      },
    ],
  },
  {
    id: "brand-foundations",
    number: "05",
    title: "Brand Foundations",
    category: "Design",
    level: "Intermediate",
    duration: "2h 50m",
    lessons: 3,
    color: "red",
    description:
      "Build a brand from a clear position, not a collection of visual tricks.",
    instructor: "Amara Cole",
    outcome:
      "Connect positioning, language and visual decisions into one system.",
    lessonsData: [
      {
        id: "position",
        title: "Position before identity",
        duration: "11 min",
        type: "text",
        body: "A visual identity is stronger when it expresses a clear position. Before choosing symbols or colors, decide who the brand serves, what it believes and what makes it meaningfully different.",
        points: [
          "Name the audience.",
          "Clarify the difference.",
          "Connect each design decision to the position.",
        ],
        quiz: [
          {
            q: "What should guide a brand identity?",
            options: [
              "A clear position",
              "A current trend alone",
              "A random color palette",
            ],
            answer: 0,
            explanation:
              "Positioning gives visual and verbal choices a reason to exist.",
          },
        ],
      },
      {
        id: "language",
        title: "A recognizable voice",
        duration: "12 min",
        type: "video",
        videoUrl: "resources/test_video_hd.mp4",
        body: "Brand voice is the pattern of choices a brand makes in language. A voice can be warm, precise, playful or direct, but it should remain recognizable across situations.",
        points: [
          "Choose a few useful voice traits.",
          "Show examples of what the voice sounds like.",
          "Adapt tone without losing character.",
        ],
        quiz: [
          {
            q: "A recognizable brand voice is…",
            options: [
              "Identical wording in every situation",
              "A consistent pattern of language choices",
              "A slogan repeated everywhere",
            ],
            answer: 1,
            explanation:
              "Voice stays consistent while tone adapts to the situation.",
          },
        ],
      },
      {
        id: "system",
        title: "Designing a flexible system",
        duration: "13 min",
        type: "text",
        body: "A system is not a set of rules that prevents change. It is a set of shared principles that helps a brand stay coherent as new materials and situations appear.",
        points: [
          "Define repeatable principles.",
          "Test the system in different formats.",
          "Allow controlled variation.",
        ],
        quiz: [
          {
            q: "A flexible brand system should…",
            options: [
              "Prevent all variation",
              "Support coherence across different formats",
              "Change completely every time",
            ],
            answer: 1,
            explanation:
              "A system provides consistency while allowing context-aware variation.",
          },
        ],
      },
    ],
  },
  {
    id: "digital-workflows",
    number: "06",
    title: "Digital Workflows",
    category: "Business",
    level: "Beginner",
    duration: "1h 55m",
    lessons: 3,
    color: "blue",
    description:
      "Make your tools support the work instead of becoming the work.",
    instructor: "Evan Brooks",
    outcome: "Design a simple, repeatable workflow for focused work.",
    lessonsData: [
      {
        id: "audit",
        title: "Audit your workflow",
        duration: "08 min",
        type: "text",
        body: "Before adding another tool, trace the work from start to finish. Look for repeated manual steps, unclear ownership and moments where information gets lost.",
        points: [
          "Map the real process.",
          "Find repeated friction.",
          "Fix the cause before adding a tool.",
        ],
        quiz: [
          {
            q: "Before changing a workflow, you should…",
            options: [
              "Buy a new tool",
              "Understand the current process",
              "Automate every step",
            ],
            answer: 1,
            explanation:
              "Understanding the current process helps you solve the right problem.",
          },
        ],
      },
      {
        id: "automation",
        title: "Automation with intention",
        duration: "10 min",
        type: "video",
        videoUrl: "resources/test_video_hd.mp4",
        body: "Automation is useful for stable, repetitive work. Keep human attention for decisions that require context, judgment or care.",
        points: [
          "Automate stable repeated steps.",
          "Keep exceptions visible.",
          "Review automated outcomes.",
        ],
        quiz: [
          {
            q: "Automation is usually most useful for…",
            options: [
              "Every decision",
              "Stable, repetitive tasks",
              "Tasks nobody understands",
            ],
            answer: 1,
            explanation: "Stable tasks are easier to automate reliably.",
          },
        ],
      },
      {
        id: "rituals",
        title: "Make the system stick",
        duration: "09 min",
        type: "text",
        body: "A workflow only works when people can maintain it. Keep the system small, assign ownership and create a regular moment to review what is helping and what is getting in the way.",
        points: [
          "Keep the system small.",
          "Make ownership clear.",
          "Review it at a regular interval.",
        ],
        quiz: [
          {
            q: "A workflow stays useful when it is…",
            options: [
              "Never reviewed",
              "Small, owned and reviewed",
              "As complex as possible",
            ],
            answer: 1,
            explanation:
              "A maintainable system has clear ownership and a regular review.",
          },
        ],
      },
    ],
  },
];
