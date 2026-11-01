from typing import List
from app.schemas.skill import Skill, Topic, SkillCatalogResponse


SKILLS_CATALOG: List[Skill] = [
    Skill(
        id="react",
        name="React",
        description="Component lifecycle, hooks, state architecture, virtual DOM reconciliation, and rendering patterns.",
        icon="Atom",
        topics=[
            Topic(
                id="hooks-lifecycle",
                name="Hooks & Component Lifecycle",
                description="Core hooks (useState, useEffect, useMemo, useCallback, useRef), rules of hooks, and custom hook design."
            ),
            Topic(
                id="state-management",
                name="State Architecture & Context",
                description="Local component state, Context API tradeoffs, and global state management patterns (Redux, Zustand)."
            ),
            Topic(
                id="reconciliation-vdom",
                name="Reconciliation & Virtual DOM",
                description="Virtual DOM diffing algorithm, key prop significance, fiber tree mechanics, and batching updates."
            ),
            Topic(
                id="performance-rendering",
                name="Performance Optimization & SSR",
                description="Memoization techniques, code splitting, lazy loading, Suspense, and Server Components vs Client Components."
            ),
            Topic(
                id="forms-events",
                name="Forms, Synthetic Events & Refs",
                description="Controlled vs uncontrolled components, synthetic event handling, DOM manipulation with refs, and form validation."
            )
        ]
    ),
    Skill(
        id="javascript",
        name="JavaScript",
        description="Core language mechanics, lexical scope, event-driven concurrency, prototypes, and modern ECMAScript specifications.",
        icon="FileCode",
        topics=[
            Topic(
                id="closures-scope",
                name="Closures & Scope Chain",
                description="Lexical environment, scope chain, closure memory behavior, variable shadowing, and hoisting."
            ),
            Topic(
                id="event-loop",
                name="Event Loop & Asynchronous JavaScript",
                description="Call stack, event loop, microtask vs macrotask queues, Promises, and async/await execution order."
            ),
            Topic(
                id="prototypes-inheritance",
                name="Prototypes & Object-Oriented JS",
                description="Prototype chain, __proto__ vs prototype, Object.create, and ES6 class syntax under the hood."
            ),
            Topic(
                id="modern-es6",
                name="Modern ES6+ Features",
                description="Destructuring, spread/rest operators, modules (ESM vs CJS), symbols, generators, and iterators."
            ),
            Topic(
                id="memory-management",
                name="Memory Management & Garbage Collection",
                description="Garbage collection algorithms (mark-and-sweep), memory leaks, WeakMap/WeakSet, and execution contexts."
            )
        ]
    ),
    Skill(
        id="typescript",
        name="TypeScript",
        description="Static type checking, structural type systems, generics, advanced utility types, and type inference.",
        icon="FileCode2",
        topics=[
            Topic(
                id="type-system",
                name="Type System Fundamentals",
                description="Primitive types, union & intersection types, type aliases, interfaces, and structural typing."
            ),
            Topic(
                id="generics",
                name="Generics & Type Constraints",
                description="Generic functions, interfaces, classes, and using generic constraints (extends) for type safety."
            ),
            Topic(
                id="advanced-types",
                name="Advanced Types & Metaprogramming",
                description="Conditional types, mapped types, infer keyword, template literal types, and keyof/indexed access."
            ),
            Topic(
                id="utility-types",
                name="Built-in Utility Types",
                description="Practical usage of Partial, Required, Readonly, Record, Pick, Omit, Exclude, and ReturnType."
            ),
            Topic(
                id="type-narrowing",
                name="Type Narrowing & Guards",
                description="Type guards (typeof, instanceof, in), discriminated unions, and user-defined type predicates (is)."
            )
        ]
    ),
    Skill(
        id="python",
        name="Python",
        description="Pythonic programming, memory model, concurrency, object-oriented design, and asynchronous execution.",
        icon="Terminal",
        topics=[
            Topic(
                id="data-structures",
                name="Core Data Structures & Collections",
                description="Lists, dicts, sets, tuples, list/dict comprehensions, time complexities, and the collections module."
            ),
            Topic(
                id="memory-gil",
                name="Memory Model & GIL",
                description="Reference counting, garbage collector generational cycles, Global Interpreter Lock (GIL), and concurrency tradeoffs."
            ),
            Topic(
                id="decorators-generators",
                name="Decorators & Generators",
                description="Higher-order functions, functools.wraps, generator functions (yield), iterables, and iterators."
            ),
            Topic(
                id="oop-dunder",
                name="Object-Oriented Python & Dunder Methods",
                description="Classes, multiple inheritance, Method Resolution Order (MRO), magic/dunder methods, and dataclasses."
            ),
            Topic(
                id="asyncio-concurrency",
                name="AsyncIO & Asynchronous Programming",
                description="Coroutines, event loops, tasks, async context managers, and writing non-blocking asynchronous code."
            )
        ]
    ),
    Skill(
        id="sql",
        name="SQL & Relational Databases",
        description="Query formulation, indexing optimization, relational modeling, transaction concurrency, and analytical queries.",
        icon="Database",
        topics=[
            Topic(
                id="joins-aggregations",
                name="Joins & Complex Aggregations",
                description="INNER, LEFT, RIGHT, FULL OUTER joins, self-joins, GROUP BY, HAVING, and set operations."
            ),
            Topic(
                id="window-functions",
                name="Window Functions & Analytical Queries",
                description="ROW_NUMBER, RANK, DENSE_RANK, NTILE, LAG, LEAD, and OVER (PARTITION BY ... ORDER BY ...)."
            ),
            Topic(
                id="indexing-optimization",
                name="Indexing & Query Optimization",
                description="B-tree vs Hash indexes, composite indexes, query planner analysis, EXPLAIN ANALYZE, and index selectivity."
            ),
            Topic(
                id="transactions-acid",
                name="Transactions & ACID Guarantees",
                description="ACID properties, transaction isolation levels (Read Committed, Repeatable Read, Serializable), locking, and deadlocks."
            ),
            Topic(
                id="schema-normalization",
                name="Schema Design & Normalization",
                description="1NF, 2NF, 3NF, denormalization strategies, primary & foreign key constraints, and cascade actions."
            )
        ]
    ),
    Skill(
        id="fastapi",
        name="FastAPI",
        description="Modern async REST APIs, dependency injection, Pydantic data validation, OpenAPI specs, and middleware pipelines.",
        icon="Server",
        topics=[
            Topic(
                id="routing-params",
                name="Routing & Request Validation",
                description="Path operations, path/query parameters, request bodies, status codes, and response models."
            ),
            Topic(
                id="dependency-injection",
                name="Dependency Injection System",
                description="Depends(), sub-dependencies, yield dependencies for database sessions/cleanup, and testing overrides."
            ),
            Topic(
                id="pydantic-validation",
                name="Pydantic Models & Serialization",
                description="Data validation, Field constraints, model validators, custom serializers, and schema generation."
            ),
            Topic(
                id="middleware-exceptions",
                name="Middleware, Security & Exceptions",
                description="CORS, custom request/response middleware, HTTPException, and global exception handlers."
            ),
            Topic(
                id="async-background",
                name="Async Architecture & Background Tasks",
                description="Asynchronous route handlers (async def vs def), threadpools, BackgroundTasks, and lifespan events."
            )
        ]
    )
]


class SkillService:
    @staticmethod
    def get_catalog() -> SkillCatalogResponse:
        """
        Return the catalog of available skills and their associated interview topics.
        """
        return SkillCatalogResponse(
            total_skills=len(SKILLS_CATALOG),
            skills=SKILLS_CATALOG
        )
