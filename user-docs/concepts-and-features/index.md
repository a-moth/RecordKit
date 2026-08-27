---
title: Concepts and Features
layout: default
---

# Concepts & Features

## Templates and entries

A template defines an ordered collection of fields and sections. An entry is created against a template and stores the values recorded by the user.

## Fields

RecordKit 1.0 supports text, number, date, time, duration, selection, scale, boolean, and image-boolean fields. Each type presents and validates data according to its purpose.

## Sections

Sections organise fields into a nested structure. Validation includes fields inside sections rather than checking only the top level.

## Validation

RecordKit displays field validation feedback while editing. A template or entry with an invalid field cannot be saved. Date and time fields allow partial typing, then report invalid values without silently rewriting them.

## Images

Image settings, image-boolean fields, and image-based scales can use bundled images or images selected by the user. Selected images are currently stored as data URIs. Version 1.3 will add the durable size-sensitive policy needed to keep large images outside entry and template records.

See [Planned Functionality](../planned-functionality/) for future work and [Limitations](../limitations/) for current boundaries.
